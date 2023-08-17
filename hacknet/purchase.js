/**
 * $Id: purchase.js v0.2 2023-08-17 16:42:05 5.70GB .m0rph $
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
 * Looper logger. We need a grepable logfile for later analysis.
 * 
 * @param {string}   data  Text that is written to the logfile.
 * @param {string}   mode  File open mode >> w = create new file, a = append to file.
 */
const timestamp = d.timestamp();
function log (ns, data, mode) {
   const m = mode ? mode : 'w';
   ns.print(`${c.cyan}${data}${c.reset}`);
   ns.write(`/log/hacknet.purchase.${timestamp}.js`, data, m);
}

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

         if (id !== -1) log(ns, `[${d.gettime()}] Purchased hacknet node ${id}.`, 'a');
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
   log(ns, `Hacknet node purchase run started at ${d.getdate()}, ${d.gettime()}:`);

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
