/**
 * filename: grow.js
 *     date: 2023-07-03
 *  version: 1.0
 *   author: .m0rph
 *      RAM: 1.80GB
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
export async function main(ns) {

   'use strict'; // We better use strict mode !!!

   let target;

   if (ns.args.length > 0) {
      // When a hostname was passed, hackit is likely to be executed from OutSide.
      target = (typeof ns.args[0] === 'string') ? ns.args[0] : undefined;
   } else {
      // Otherwise hackit is executed by the target itself.
      target = ns.getHostname();
   }

   if (target) {
      while(true) {
         await ns.grow(target);
      }
   }
}