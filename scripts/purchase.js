/** 
 * Id: purchase.js v0.8 2023-08-28 09:00:22 8.45GB .m0prh $
 * 
 * Options:
 *    -r [0-9]+   RAM for server to purchase
 *    -c [0-9]+   Maximum count of servers to purchase
 * 
 * Note:
 *    Script usable AFTER the first home server RAM upgrade !!!
 * 
 *    pserv-maxRam: 2 ** 20 == 1049576 
 * 
 * @param {NS}       ns    The Netscript API.
 * @param {number}   ram?  Optional: RAM size (default size 8192GB)
 */

import {c} from '/modules/colors.js';
import {get_option} from '/modules/arguments.js'

export async function main(ns) {

   ns.disableLog('sleep');
   ns.tail();

   const
      master   = '/looper/master.js',
      files    = [
         '/modules/colors.js', '/modules/datetime.js', 'modules/arguments.js',
         '/looper/weaken.js', '/looper/grow.js', '/looper/hack.js', master
      ],
      ram      = get_option(ns, '-r') ?? 8192,
      max      = get_option(ns, '-c') ?? 25,
      cost     = ns.getPurchasedServerCost(ram),  // 0.25GB
      start    = ns.getPurchasedServers().length; // 2.25GB


   /**
    * At first we purchase the servers.
    */
   let i = start;
   while (i < start + max)
   {
      let money = ns.getServerMoneyAvailable('home'); // 0.1GB
      // Continously try to purchase a server until we've reached the
      // maximum amount of servers.
      if (money > cost)
      {
         let hostname = ns.purchaseServer(`pserv-${i}`, ram); // 2.25GB

         if (hostname == '')
         {
            ns.printf(`${c.red}Failed to purchase server !!!${c.reset}`);
            ns.exit();
         }
         else
         {
            files.forEach(file => {
               if (!ns.fileExists(file, hostname))
               {
                  // Deploy purchased server.
                  ns.printf(`${c.cyan}Copying ${file} to ${hostname}`);
                  ns.scp(file, hostname);
               }
            });

            i++;
         }
      }
      else
         ns.printf(`${c.white}SeverCost is at ${ns.formatNumber(cost)}. Not enough money. Waiting ...${c.reset}`); 

      // We need to wait for a second, otherwise the script will
      // fall into an infinite loop and the game will crash!
      await ns.sleep(1000);
   }
}
