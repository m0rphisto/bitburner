/**
 * $Id: master.js v0.3 2023-08-05 13:55:49 CEST 6.95GB .m0rph $
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

import {
   has_count,
   is_string,
   is_boolean
} from '/modules/arguments.js';

export function autocomplete(data, args) {
   return [...data.servers];
}

export async function main(ns) {

   'use strict';


   /**
    * Error exit handler.
    * 
    * @param {string}   msg   Error message.
    */
   function exit (msg) {
      ns.tprintf(`${c.red}ERROR: ${msg} Exiting !!!${c.reset}`);
      ns.exit();
   }
   

   /**
    * Kill the actual script on the target server.
    *
    * @returns {boolean} True if the process was killed correctly, false otherwise.
    */
   function kill (pid, cmd) {
      let retval, msg = `${d.gettime()}: Trying to kill pid(${pid}) ${cmd} ... `;
      retval = ns.kill(pid) ? 'OK' : 'FAILED';
      ns.print(`${c.cyan}${msg}${retval}${c.reset}`);
      return retval == 'OK' ? true : false;
   }

   /**
    * At first the parameter validation.
    */
   has_count(ns.args, 0) ? exit('No target passed') : null;

   has_count(ns.args, 1)
      ? is_string(ns.args[0]) 
         ? ns.serverExists(ns.args[0]) ? null : exit(`Target ${ns.args[0]} does not exist.`)
         : exit(`ERROR :: ${ns.args[0]} :: String expected.`)
      : null;

   const sself =
      has_count(ns.args, 2)
         ? ns.args[1] === 0 || ns.args[1] === 1
            ? !!ns.args[1]
            : is_boolean(ns.args[1]) 
               ? ns.args[1]
               : exit(`ERROR :: ${ns.args[1]} :: Bool integer or boolean expected.`)
         : false;

   /**
    * Then the initialization section,
    */
   const
      target         = ns.args[0];
   
   const
      base           = sself ? ns.getHostname() : target,
      args           = sself ? [target] : [''],

      hack           = '/looper/hack.js',
      grow           = '/looper/grow.js',
      weaken         = '/looper/weaken.js',
      master         = '/looper/master.js';

   const
      min_security   = ns.getServerMinSecurityLevel(target),
      max_money      = ns.getServerMaxMoney(target),
      max_ram        = ns.getServerMaxRam(base);

   const
      has_ram        = max_ram - ns.getServerUsedRam(base),
      weaken_ram     = ns.getScriptRam(weaken),
      grow_ram       = ns.getScriptRam(grow),
      hack_ram       = ns.getScriptRam(hack);

   const
      weaken_threads = Math.floor(has_ram / weaken_ram),
      grow_threads   = Math.floor(has_ram / grow_ram),
      hack_threads   = Math.floor(has_ram / hack_ram);

   const
      weaken_thresh  = min_security * 1.25,
      money_thresh   = max_money    * 0.75;

// DEBUG
//exit(`target: ${target}, base: ${base},  sself: ${sself}, args: ${args}`);

   // At first we need to manipulate the log-window's title bar.
   ns.setTitle(`.m0rph@${ns.getHostname()}:/looper/master.js ${target}`)


   let money, sec, cmd, pid = 0;

   // At the beginning we start a weaken script ...
   cmd = weaken;
   pid = ns.exec(cmd, base, weaken_threads, ...args);
   ns.print(`${c.cyan}${d.gettime()}: Started pid(${pid}) ${cmd} on ${base}.${c.reset}`);
   await ns.sleep(ns.getWeakenTime(target) * 1.15);
   ns.deleteServer; // Just a little static RAM feed3r ... 2.25GB

   for (;;) {

      // And then we start monitoring.

      money = ns.getServerMoneyAvailable(target),
      sec   = ns.getServerSecurityLevel(target);

      if (money >= money_thresh) {

         // Money threshold reached, so we hack the box.

         //if (cmd != hack) {
            if (kill(pid, cmd)) {
               cmd = hack;
               pid = ns.exec(cmd, base, hack_threads, ...args);
               ns.print(`${c.cyan}${d.gettime()}: Started pid(${pid}) ${cmd} on ${base}.${c.reset}`);
               await ns.sleep(ns.getHackTime(target) * 1.15);
            }
            else {
               ns.print(`${c.red}ERROR: Could not kill pid(${pid}) ${cmd} on ${base}. Exiting !!!${c.reset}`);
               ns.exit();
            }
         //}
      }
      else if (sec >= weaken_thresh) {

         // Too high security level, we have to weaken.

         //if (cmd != weaken) {
            if (kill(pid, cmd)) {
               cmd = weaken;
               pid = ns.exec(cmd, base, weaken_threads, ...args);
               ns.print(`${c.cyan}${d.gettime()}: Started pid(${pid}) ${cmd} on ${base}.${c.reset}`);
               await ns.sleep(ns.getWeakenTime(target) * 1.15);
            }
              else {
               ns.print(`${c.red}ERROR: Could not kill pid(${pid}) ${cmd} on ${base}. Exiting !!!${c.reset}`);
               ns.exit();
            }
         //}
      }
      else {

         // Otherwise grow to the max.

         //if (cmd != grow) {
            if (kill(pid, cmd)) {
               cmd = grow;
               pid = ns.exec(cmd, base, grow_threads, ...args);
               ns.print(`${c.cyan}${d.gettime()}: Started pid(${pid}) ${cmd} on ${base}.${c.reset}`);
               await ns.sleep(ns.getGrowTime(target) * 1.15);
            }
            else {
               ns.print(`${c.red}ERROR: Could not kill pid(${pid}) ${cmd} on ${base}. Exiting !!!${c.reset}`);
               ns.exit();
            }
         //}
      }
   }
}
