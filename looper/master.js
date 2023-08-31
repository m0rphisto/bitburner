/**
 * $Id: master.js v1.0 2023-08-31 17:01:46 CEST 4.75GB .m0rph $
 * 
 * Description:
 *    This is the looper master, that utilizes looper/{hack,grow,weaken}.js
 * 
 *    The looper scripts are needed during the early phase of the first level
 *    in a BitNode, when no TerraByes of RAM are available, neither on the
 *    home machine nor on purchased servers. This strategy is usable after
 *    the first RAM upgrade of the home server to 8GB.
 * 
 *    In the beginning of a BitNode a little hand work is nessecary.
 *    For that we use exploit and hackit. ;-)
 * 
 * Note:
 *    The looper scripts have to be available on the target server.
 *    We use looper/deploy.js for that in front.
 * 
 * Note from discord:
 *    weaken is 4x hacktime, grow is 3.2x, hack is 1x
 *    ToDo: bake it into the monitoring.
 * 
 * 
 * @param {NS}       ns       The Netscript API.
 * @param {string}   target   Hostname of the target server.                       (ns.args[0])
 * @param {boolean}  sself    Whether the master controls HGW externally or not.   (ns.args[1])
 *                            True if the master controls HGW on the same machine            
 *                            and attacks an external target, e.g. on a purchased
 *                            server, false otherwise.
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';
import {exit} from '/modules/helpers.js';
import {
   has_count,
   is_string,
   is_boolean
} from '/modules/arguments.js';


export function autocomplete(data, args) {
   return [...data.servers];
}

class Job
{
   /**
    * At the moment we do not really need an expensive class for this,
    * but this looper will be the base for a batcher, respectively 
    * proto-batcher coming soon.
    *
    * Inspiration found on:
    *    https://darktechnomancer.github.io/
    *
    *    Thank you very much for this excellent beginner's guide!
    *
    *                            <(°)
    *                             / \
    *    Have a lot of fun ...    \ /
    *                            ''''
    */
   constructor(type, target)
   {
      this.pid     = 0;       // The master PID
      this.spid    = 0;       // The script PID
      this.type    = type;    // The job type (H/G/W)
      this.target  = target;  // The target to attack
      this.threads = 1;       // The job's threads count
   }
}

export async function main(ns) {

   'use strict';

   const DEV = '', MAX = 3212;

   /**
    * Kill the actual script on the target server.
    *
    * @returns {boolean} True if the process was killed correctly, false otherwise.
    */
   function kill (pid, cmd) {
      let retval, msg = `${d.gettime()}: Trying to kill pid(${pid}) ${cmd} ... `;
      retval = ns.kill(pid) ? 'OK' : 'FAILED';
      ns.print(`${c.cyan}${msg}${retval}`);
      return retval == 'OK' ? true : false;
   }


   /**
    * At first the parameter validation.
    */
   has_count(ns.args, 0) ? exit(ns, 'No target passed') : null;

   has_count(ns.args, 1)
      ? is_string(ns.args[0]) 
         ? ns.serverExists(ns.args[0]) ? null : exit(ns, `Target ${ns.args[0]} does not exist.`)
         : exit(ns, `ERROR :: ${ns.args[0]} :: String expected.`)
      : null;

   const sself =
      has_count(ns.args, 2)
         ? ns.args[1] === 0 || ns.args[1] === 1
            ? !!ns.args[1]
            : is_boolean(ns.args[1]) 
               ? ns.args[1]
               : exit(ns, `ERROR :: ${ns.args[1]} :: Bool integer or boolean expected.`)
         : false;

   /**
    * Then the initialization section,
    */
   const
      target    = ns.args[0],
      base      = sself ? ns.getHostname() : target,
      max_money = ns.getServerMaxMoney(target),
      max_ram   = ns.getServerMaxRam(base),
      has_ram   = max_ram - ns.getServerUsedRam(base);


   // For the case the target server has no RAM, we have to trow an error!
   if (max_ram < 1)
      exit(ns, `${target}'s maxRam is at ${ns.formatRam(max_ram)}! You should consider looping local.`);

   // For the case the target has no max money, it makes no sense to hack this one.
   if (max_money == 0)
      exit(ns, `${target}'s maxMoney is at ${ns.formatNumber(max_money)}! Hacking this one makes no sense.`);

   // Want to inspect the running tail window? Manipulate the title bar.
   ns.setTitle(`.m0rph@${ns.getHostname()}:/looper${DEV}/master.js ${target} ${base}`);

   const
      job      = {},
      ports    = {},
      scripts  = new Map(),
      types    = ['weaken', 'grow', 'hack'];


   for (let type of types)
   {
      scripts.set(type, `/looper${DEV}/${type}.js`);

      job[type]         = new Job(type, target);
      job[type].pid     = ns.pid;
      job[type].target  = target;
 
      let max = Math.floor(has_ram / ns.getScriptRam(scripts.get(type))); 
      job[type].threads = base == 'home' && max > MAX ? MAX : max;
   }

   // At the beginning we start a weaken script ...
   let cmd = 'weaken';
   sself || ns.killall(base);
   job[cmd].spid = ns.exec(scripts.get(cmd), base, job[cmd].threads, JSON.stringify(job[cmd]));
   ns.print(`${c.cyan}${d.gettime()}: Started pid(${job[cmd].spid}) ${cmd} on ${base}.`);
   ports[cmd] = ns.getPortHandle(job[cmd].spid);
   ports[cmd].clear();


   for (;;)
   {
      await ports[cmd].nextWrite();

      if (1 === ports[cmd].read())
      {
         // OK, the worker sends a signal that the job is done.

         let next = 
            ns.getServerSecurityLevel(target) >= ns.getServerMinSecurityLevel(target) * 1.25
               ? 'weaken'
               : ns.getServerMoneyAvailable(target) >= max_money * 0.75
                  ? 'hack'
                  : 'grow';

         if(next != cmd)
         {
            // We need a new job, so we kill the old one ...

            if (kill(job[cmd].spid, scripts.get(cmd)))
            {
               // ... and start a new.

               cmd = next;
               sself || ns.killall(base);
               job[cmd].spid = ns.exec(scripts.get(cmd), base, job[cmd].threads, JSON.stringify(job[cmd]));
               ns.print(`${c.cyan}${d.gettime()}: Started pid(${job[cmd].pid}) ${cmd} on ${base}.`);
               ports[cmd] = ns.getPortHandle(job[cmd].spid);
               ports[cmd].clear();
               //ns.writePort(ns.pid, 1);
            }
            else
            {
               // WOW, something went terribly wrong and we gotta get out.

               exit(ns, `Could not kill pid(${job[cmd].pid}) ${scripts.get(cmd)} on ${base}.`);
            }
         }
      }
   }
}
