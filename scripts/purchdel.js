/** 
 * $Id: purchdel.js v0.2 2023-08-09 21:56:14 6.80GB .m0rph $
 * 
 * @param {NS} ns The Netscript API.
 */

import {c} from '/modules/colors.js';

export async function main(ns) {

   'use strict';

   const pservers = ns.getPurchasedServers();
   let   count    = 0;

   ns.tprintf(`${c.cyan}We have ${pservers.length} purchased servers available.${c.reset}`);

   for (let pserver of pservers)
   {
      ns.killall(pserver);
      ns.deleteServer(pserver);
      count++;
   }
   
   ns.tprintf(`${c.cyan}${count} Servers deleted. Ready to purchase bigger ones!`);
}
