/**
 * $Id: master.js v1.2 2023-09-23 03:05:09 CEST 5.10GB .m0rph $
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
 * 2023-09-17: ToDo:
 *    Check if the const get_max_threads = (ns, master, weaken, host = 'home') => {
 *    has to be reworked! Sometime, especially after a RAM Upgrade, one nullRAMer
 *    grabs off the COMPLETE memory.
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


export function autocomplete(data) {
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

/**
 * We need the count of r00ted servers that have 0GB RAM for
 * the calculation of the max possible worker threads.
 *  
 * @param {NS} ns The Netscript API.
 * @returns {number} How many elements has the set?
 */
const get_null_rams = (ns) => {
   let net = new Set(['home']);
   net.forEach(a => ns.scan(a).forEach(b => net.add(b).delete('home')));
   net.forEach(a => ns.hasRootAccess(a) || net.delete(a));
   net.forEach(a => ns.getServerMaxRam(a) === 0 || net.delete(a));
   net.forEach(a => ns.getServerMaxMoney(a) === 0 && net.delete(a));
   return net.size;
}

/**
 * Calculate the max possible threads, taking account of all already running masters, etc.
 * 
 * @param {NS} ns The Netscript API.
 * @param {string} master The master's filename.
 * @param {string} weaken The worker's filename.
 * @param {string} host The host that the job is running on.
 * @returns {number} Maximum count of a job thread.
 */
const get_max_threads = (ns, master, weaken, host = 'home') => {
   const // should be: weaken 1.75, grow 1.75, hack 1.60
      has_ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host), // home has xGB available RAM (maxRam minus other running masters)
      null_rams = get_null_rams(ns), // we have x nullRAMer
      master_ram = ns.getScriptRam(master), // 1 thread of a master needs xGB (5.10)
      weaken_ram = ns.getScriptRam(weaken), // 1 thread of a weaken worker needs xGB (1.75)
      master_ram_need = null_rams * master_ram, // we have x nullRAMers and need x masters
      has_weaken_ram = has_ram - master_ram_need; // the rest is available for x nullRAMer's workers
      // and what to do, if no more sufficient RAM is available?
      if (has_weaken_ram > weaken_ram) {
         return Math.floor(has_weaken_ram / (weaken_ram * null_rams));
      } else {
         exit(ns, `Sorry, we have no more RAM left on ${host}.`);
      }
}

export async function main(ns) {

   'use strict';

   const DEV = '';

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
      scripts.set(type, `/looper${DEV}/${type}.js`);

   const MAX = get_max_threads(ns, ns.getScriptName(), scripts.get('weaken'));

   for (let type of types)
   {
      job[type]         = new Job(type, target);
      job[type].pid     = ns.pid;
      job[type].target  = target;
 
      let max = Math.floor(has_ram / ns.getScriptRam(scripts.get(type))); 
      job[type].threads = base == 'home' ? MAX : max;
      // something's buggy here...
      //job[type].threads = base == 'home' && max > MAX ? MAX : max;
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

         if (next != cmd)
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
