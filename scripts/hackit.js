/**
 * filename: hackit.js
 *     date: 2023-07-08
 *  version: 0.5
 *   author: .m0rph
 *      RAM: 3.75GB (with import of arguments.js)
 *      RAM: 2.55GB (without import)
 *           1.20GB difference !!!
 * 
 * !!! Note:
 * !!!   The await keyword is needed for hack(), grow() and weaken(), because these commands take time to execute.
 * !!!   If we forget to await these commands, we will get an exeption saying that we're doing multiple things at
 * !!!   once, because our code will immediately finish the function call without waiting for the operation to be done.
 * !!!   Also important is that await can only be used in functions marked async, which main() is!
 * 
 * @param {NS} ns 
 * @param      ns.args[0]  string   hostname of target server
 */

//import {ma} from '/modules/arguments.js';
//import {mc} from '/modules/colors.js';

export async function main(ns) {

   'use strict'; // We better use strict mode !!!


   //let target = (ma.count(ns.args, 1) && ma.str(ns.args[0])) ? ns.args[0] : undefined, moneyThresh, securityThresh; 
   let target = (ns.args.length == 1 && typeof ns.args[0] === 'string') ? ns.args[0] : undefined;

   // If no target was passed, hackit is executed by the target itself.
   if (! target) target = ns.getHostname();
   if (  target) {
      // We only need to do the job, if the target is defined
      // and if the passed target does exist.
      if (! ns.serverExists(target)) {
         ns.tprintf("ERROR: Server %s doesn't exist. Exiting !!!", target);
         ns.exit();
      }

      // At first we need to manipulate the log-window's title bar.
      ns.setTitle(`.m0rph@${ns.getHostname()}:/scripts/hackit.js ${target}`);


      let moneyThresh    = ns.getServerMaxMoney(target) * 0.75;       // 75% of the server's MaxMoney
      let securityThresh = ns.getServerMinSecurityLevel(target) + 1.5 // Maximum allowed security level.

      while(true) {
         // Infinite loop for continously weakening/growing/hacking the target server.
         if (ns.getServerSecurityLevel(target) > securityThresh) {
            // Actual server security higher than our threshold, then weaken.
            await ns.weaken(target);
         } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            // Actual available money less than our threshold, then grow.
            await ns.grow(target);
         } else {
            // Everything good, then hack the shack!
            await ns.hack(target);
         }
      }
   }
}