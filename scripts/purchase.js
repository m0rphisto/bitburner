/** 
 * Id: purchase.js v0.5 2023-08-15 19:40:16 6.45GB .m0prh $
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

export async function main(ns) {

   ns.tail();

   const
      master   = '/looper/master.js',
      files    = [
         '/modules/colors.js', '/modules/datetime.js', 'modules/arguments.js',
         '/looper/weaken.js', '/looper/grow.js', '/looper/hack.js', master
      ],
      ram      = ns.args[0] ?? 8192,
      cost     = ns.getPurchasedServerCost(ram); // 0.25GB

   /**
    * At first we purchase the servers.
    */
      
   let i = 0;
   while (i < ns.getPurchasedServerLimit()) // 0.05GB
   {
      let money = ns.getServerMoneyAvailable('home'); // 0.1GB
      // Continously try to purchase a server until we've reached the
      // maximum amount of servers.
      if (money > cost)
      {
         let hostname = ns.purchaseServer(`pserv-${i}`, ram); // 2.25GB

         if (hostname == '')
         {
            ns.printf(`${c.red}Failed to purchase server ram(${ram}) !!!${c.reset}`);
            ns.exit();
         }
         else
            i++;
      }
      else
         ns.printf(`${c.white}SeverCost is at ${ns.formatNumber(cost)}. Not enough money. Waiting ...${c.reset}`); 

      // We need to wait for a second, otherwise the script will
      // fall into an infinite loop and the game will crash!
      await ns.sleep(1000);
   }

   /**
    * OK, we should now have 25 purchased servers, and we have 25 servers with 0.00GB RAM
    * on the network which make sense to attack. So we can let exactly one purchased server
    * attack one null RAMmer. ;-)
    */
   i = 0;
   let no_ram = new Set(['home']);
   no_ram.forEach(a => ns.scan(a).forEach(b => no_ram.add(b).delete('home'))); // 0.2GB
   no_ram.forEach(a => ns.getServerMaxRam(a) > 0 && no_ram.delete(a)); // 0.05GB
   ['darkweb','The-Cave','w0r1d_d3m0n'].forEach(h => no_ram.delete(h)); // Has 0GB but $0 max also
   no_ram.forEach(nram => {

      // Purchased server already deployed?
      ns.scp(files, `pserv-${i}`); // 0.6GB

      if (ns.hasRootAccess(nram)) // 0.05GB
      {
         // OK, starting the looper master.
         ns.printf(`${c.cyan}pserv-${i}: Starting ${master} ${nram} true${c.reset}`);
         let pid = ns.exec(master, `pserv-${i}`, 1, ...[nram, true]); // 1.3GB

         if (pid == 0)
            ns.printf(`${c.red}Could not start the looper master.${c.reset}`);
         
      }
      else
         ns.printf(`${c.magenta}No root access to ${nram}, so not starting looper master !!!${c.reset}`)

      i++;
   });
}
