/**
 * $Id: purchase.js v0.3 2023-09-02 19:47:11 5.70GB .m0rph $
 * 
 * description:
 *    Automated hacknet management process.
 * 
 * Note:
 *  1 ms, 1e3=sec, 6e4=min, 36e5=hour
 * 
 *  @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';


/**
 * Purchase hacknet nodes.
 * 
 * @param {NS}       ns         The Netscript API
 * @param {number}   num_nodes  Next purchase range.
 */
async function purchase(ns, num_nodes)
{
   'use strict';

   if (ns.hacknet.numNodes() > num_nodes) return;

   for (let i = ns.hacknet.numNodes(); i < num_nodes; i++)
   {
      if (ns.getServerMoneyAvailable('home') > ns.hacknet.getPurchaseNodeCost())
      {
         let id = ns.hacknet.purchaseNode();

         if (id !== -1) ns.print(`${c.cyan}[${d.gettime()}] Purchased hacknet node ${id}.`);
         else
            throw new Error(`Could not purchase hacknet node ${id}.`);
      }
      else
         await ns.sleep(6e4);
   }
}

export async function main(ns) {

   'use strict';

   let
      num_nodes = [6,    12,    24,  30],
      num_money = [10e6, 100e6, 1e9, 100e9];
   
   ns.disableLog('sleep');
   ns.disableLog('getServerMoneyAvailable' );
   ns.print(`${c.cyan}Hacknet node purchase run started at ${d.getdate()}, ${d.gettime()}:`);

   // We start at a number of three hacknet nodes ...
   await purchase(ns, 3);

   while (num_nodes.length > 0)
   {
      if (ns.getServerMoneyAvailable('home') > num_money[0])
      {
         // ... and then iterate our num_nodes list.
         await purchase(ns, num_nodes[0]);

         if (ns.hacknet.numNodes() >= num_nodes[0])
         {
            num_nodes.shift();
            num_money.shift();
         }
      }
      await ns.sleep(6e4);
   }
}