/**
 * filename: share.js
 *     date: 2023-07-29
 *  version: 1.0
 *   author: .m0rph
 *      RAM: 1.75GB
 * 
 * description:
 *    Sharing the home server's RAM with factions. Does increase the reputation gain.
 *    Scales with the thread count! More threads => more gain.
 * 
 * !!! Note: ns.share is a promise.
 * 
 * @param {NS} ns 
 */
export async function main(ns) {

   'use strict'; // We better use strict mode !!!

   // At first we need to manipulate the log-window's title bar.
   ns.setTitle(`.m0rph@${ns.getHostname()}:/scripts/share.js`);


   /**
    * while(true) is the same as for(;;), an infinite loop, but
    * the for infinite needs less bytes in the script.
    */
   for (;;) await ns.share();
}

