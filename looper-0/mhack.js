/**
 * $Id: mhack.js v1.0 2023-08-09 00:21:41 CEST 3.40GB .m0rph $
 *  
 * description:
 *    Regularly hack.js is utilized by the looper master, but in the early phase of a BitNode, where no purchased
 *    servers are available, we have to H/G/W 0.00GB RAM servers externally from the home server. In that case,
 *    mhack.js will repeatedly check, wether on the target the money was raised to the max or not.
 * 
 * @param {NS}       ns          The Netscript API
 * @param {string}   ns.args[0]  Hostname of the target server.
 */
import {c} from '/modules/colors.js';
import {has_count, is_string} from '/modules/arguments.js';
export function autocomplete(data, args) { return [...data.servers] }
export async function main(ns) {

   if (has_count(ns.args, 1) && is_string(ns.args[0]) && ns.serverExists(ns.args[0]))
   {
      while(true)
      {
         if (ns.getServerMoneyAvailable(ns.args[0]) < ns.getServerMaxMoney(ns.args[0]) * 0.9)
         {
            ns.printf(`Waiting, while money is raised.`);
            await ns.sleep(ns.getWeakenTime(ns.args[0]));
         }
         else
            await ns.hack(ns.args[0]);
      }
   }
   else
   {
      ns.tprintf(`${c.red}This is mhack. We need a valid target. Exiting!!!${c.reset}`)
   }
}
