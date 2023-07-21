/** 
 * filename: purchdel.js
 *     date: 2023-07-21
 *  version: 0.1
 *   author: .m0rph
 *      RAM: 6.30GB
 * 
 * @param {NS} ns
 */

import {c} from '/modules/colors.js';

export async function main(ns) {

   'use strict';

   const hackit   = 'scripts/hackit.js';
   const pservers = ns.getPurchasedServers();
   let   count    = 0;

   ns.tprintf(`${c.cyan}We have ${pservers.length} purchased servers available.${c.reset}`);

   for (let pserver of pservers){

      // At first we have to kill running scripts!
      let ps = ns.ps(pserver);

      for (let p of ps) {

         if (p.filename == hackit) {
            ns.tprintf(`${c.cyan}> ${c.yellow}Killing hackit with pid(${p.pid}) on ${pserver} ...${c.reset}`);
         }        

         if (ns.kill(p.pid)) { ps = null }
         else {
            ns.tprintf(`${c.cyan}> ${c.red}ERROR :: hackit on ${c.yellow}${pserver}${c.reset} and cannot be killed!${c.reset}`);
         }
      }        

      if (!ps) {
         ns.tprintf(`${c.cyan}> Deleting ${pserver} ...${c.reset}`);
         ns.deleteServer(pserver);
         count++;
      }
      else {
         ns.tprintf(`${c.cyan}> Purchased server ${pserver} cannot be deleted!${c.reset}`);
      }
   }
   ns.tprintf(`${c.cyan}${count} Servers deleted. Ready to purchase bigger ones!`);
}
