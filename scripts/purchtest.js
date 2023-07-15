/** 
 * filename: purchtest.js
 *     date: 2023-07-10
 *  version: 0.2
 *   author: .m0rph
 *      RAM: 4.25GB
 * 
 * @param {NS} ns
 *             ns.args[0]  number   RAM size
 *             ns.args[1]  number   Server count to purchase (complete price for n servers)
 */

import {c} from '/modules/colors.js';
import {a} from '/modules/arguments.js';

export async function main(ns) {

   if (ns.args.length > 0) {
      
      let num = (a.count(ns.args, 2) && a.int(ns.args[1])) ? ns.args[1] : 0;

      if (a.int(ns.args[0])) {
         const ram   = ns.args[0];
         const money = ns.formatNumber(ns.getServerMoneyAvailable('home'));
         const cost  = ns.getPurchasedServerCost(ram);
         const limit = ns.getPurchasedServerLimit();
         const buyed = ns.getPurchasedServers().length;
         const max   = ns.getPurchasedServerLimit();
         
         //const cyan  = "\u001b[36m";
         //const reset = "\u001b[0m"

         ns.tprintf(`${c.cyan}We have \$%s available.${c.reset}`, money);
         ns.tprintf(`${c.cyan}A server at %s RAM costs \$%s.${c.reset}`, ns.formatRam(ram), ns.formatNumber(cost));
         ns.tprintf(`${c.cyan}We have buyed %s of %s servers yet.${c.reset}`, (buyed != '') ? buyed : 'none', max);
         if (num > 0)
            ns.tprintf(`${c.cyan}%d servers will cost \$%s.${c.reset}`, num, ns.formatNumber(cost * num));

      } else {
         ns.tprint(
            "ERROR ARGS :: "+
               "\n\targs[0]->(INTEGER || valid RAM size),"+
               "\n\targs[1]->(INTEGER || valid server count [optional])"+
               "\n\nExiting !!!"
         );
      }
   } else {
      ns.tprintf(`${c.red}No arguments passed. Exiting !!!${c.reset}`);
   }
}
