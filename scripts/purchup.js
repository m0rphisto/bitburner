/** 
 * Id: purchup.js v0.1 2023-08-21 23:02:15 5.20GB .m0prh $
 * 
 * 
 * Description:
 *    Upgrade RAM of purchased servers.
 * 
 * Note:
 *    Script usable AFTER the first home server RAM upgrade !!!
 * 
 *    pserv-maxRam: 2 ** 20 == 1049576 
 * 
 * @param {NS}       ns    The Netscript API.
 * @param {number}   ram   Amount of RAM to upgrade to (default size 8192GB)
 *                         MUST be a power of 2 (8, 16, 32, 64, ..., n) !!!
 */

import {d} from '/modules/datetime.js';

export async function main(ns) {

   /**
    * Logging facility.
    */
   const log = (msg) => {
      const
         file = `/log/purchup.${d.timestamp()}.js`,
         mode = ns.fileExists(file) ? 'a' : 'w';

      ns.write(file, `[${d.gettime()}] ${msg}\n`, mode);
   }
   log(`Purchased servers upgrade run started at: ${d.getdate()}, ${d.gettime()}\n`);

   const ram = ns.args[0] ?? 8192;
   let
      pservs = new Set(['home']);
      pservs.forEach(a => ns.scan(a).forEach(b => b.match('pserv') && pservs.add(b).delete('home')));

   for (let ps of pservs)
   {
      let
         money = ns.getServerMoneyAvailable('home'),
         cost  = ns.getPurchasedServerUpgradeCost(ps, ram);
      
      if (money > cost && ns.getServer(ps).maxRam < ram)
      {
         ns.upgradePurchasedServer(ps, ram)
            ? log(`${ps} upgraded to ${ram}GB.\n`, 'a')
            : log(`${ps} upgrade to ${ram}GB FAILED.\n`, 'a');
      }

      await ns.sleep(1000);
   }
}
