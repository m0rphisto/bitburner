/**
 * $Id: master.js v0.1 2023-08-01 20:52:59 CEST 4.60GB .m0rph $
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
 * @param {string}   target   Hostname of the target server.   (ns.args[0])
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';
import {a} from '/modules/arguments.js';

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
   a.count(ns.args, 1)
      ? a.str(ns.args[0]) 
         ? ns.serverExists(ns.args[0]) ? null : exit('Target does not exist.')
         : exit('String expected.')
      : exit('No target passed');
      

   /**
    * Then the initialization section,
    */
   const
      target         = ns.args[0],

      hack           = '/looper/hack.js',
      grow           = '/looper/grow.js',
      weaken         = '/looper/weaken.js';

   const
      min_security   = ns.getServerMinSecurityLevel(target),
      max_money      = ns.getServerMaxMoney(target),
      max_ram        = ns.getServerMaxRam(target);

   const
      weaken_threads = Math.floor(max_ram / ns.getScriptRam(weaken, target)),
      grow_threads   = Math.floor(max_ram / ns.getScriptRam(grow,   target)),
      hack_threads   = Math.floor(max_ram / ns.getScriptRam(hack,   target));

   const
      weaken_thresh  = min_security * 1.25,
      money_thresh   = max_money    * 0.75;



   let money, sec, cmd, pid = 0;

   // At the beginning we start a weaken script ...
   cmd = weaken;
   pid = ns.exec(cmd, target, weaken_threads);
   ns.print(`${c.cyan}${d.gettime()}: Started pid(${pid}) ${cmd}.${c.reset}`);
   await ns.sleep(ns.getWeakenTime(target) * 1.15);

   for (;;) {

      // And then we start monitoring.

      money = ns.getServerMoneyAvailable(target),
      sec   = ns.getServerSecurityLevel(target);

      if (money >= money_thresh) {

         // Money threshold reached, so we hack the box.

         //if (cmd != hack) {
            if (kill(pid, cmd)) {
               cmd = hack;
               pid = ns.exec(cmd, target, hack_threads);
               ns.print(`${c.cyan}${d.gettime()}: Started pid(${pid}) ${cmd}.${c.reset}`);
               await ns.sleep(ns.getHackTime(target) * 1.15);
            }
            else {
               ns.print(`${c.red}ERROR: Could not kill pid(${pid}) ${cmd}. Exiting !!!${c.reset}`);
               ns.exit();
            }
         //}
      }
      else if (sec >= weaken_thresh) {

         // Too high security level, we have to weaken.

         //if (cmd != weaken) {
            if (kill(pid, cmd)) {
               cmd = weaken;
               pid = ns.exec(cmd, target, weaken_threads);
               ns.print(`${c.cyan}${d.gettime()}: Started pid(${pid}) ${cmd}.${c.reset}`);
               await ns.sleep(ns.getWeakenTime(target) * 1.15);
            }
              else {
               ns.print(`${c.red}ERROR: Could not kill pid(${pid}) ${cmd}. Exiting !!!${c.reset}`);
               ns.exit();
            }
         //}
      }
      else {

         // Otherwise grow to the max.

         //if (cmd != grow) {
            if (kill(pid, cmd)) {
               cmd = grow;
               pid = ns.exec(cmd, target, grow_threads);
               ns.print(`${c.cyan}${d.gettime()}: Started pid(${pid}) ${cmd}.${c.reset}`);
               await ns.sleep(ns.getGrowTime(target) * 1.15);
            }
            else {
               ns.print(`${c.red}ERROR: Could not kill pid(${pid}) ${cmd}. Exiting !!!${c.reset}`);
               ns.exit();
            }
         //}
      }
   }
}
