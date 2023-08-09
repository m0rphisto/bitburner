/** 
 * Id: purchase.js v0.3 2023-08-09 20:54:45 6.60GB .m0prh $
 * 
 *  pserv-maxRam: 2 ** 20 == 1049576 
 * 
 * @param {NS} ns
 *             ns.args[0]  number   RAM size
 *             ns.args[1]  string   Target server (MUST be a valid hostname)
 */
export async function main(ns) {

   if (ns.args.length > 0) {
      if (
         typeof ns.args[0] === 'number' && 
         typeof ns.args[1] === 'string' &&
         ns.serverExists(ns.args[1])
      ) {
         const
            hackit    = '/scripts/hackit.js',
            ram       = ns.args[0],
            target    = ns.args[1],
            scriptram = ns.getScriptRam(hackit),
            threads   = Math.floor(ram / scriptram), // Just cut the fraction ... (64.803 -> 64)
            cost      = ns.getPurchasedServerCost(ram),
            limit     = ns.getPurchasedServerLimit(),
            buyed     = ns.getPurchasedServers();
         
         let i = 0;
         while (i < limit && buyed != limit)
         {
            let money = ns.getServerMoneyAvailable('home');
            // Continously try to purchase a server until we've reached the
            // maximum amount of servers.
            if (money > cost)
            {
               let hostname = ns.purchaseServer(`pserv-${i++}`, ram);
               ns.scp(hackit, hostname);
               ns.exec(hackit, hostname, threads, target);
               ns.printf(`SUCCESS :: Purchased ${hostname} is running and hacking ${target}.`)
            }
            else
            {
               ns.printf(`SeverCost is at ${ns.formatNumber(cost)}. Not enough money!`); 
            }

            // We need to wait for a second, otherwise the script will
            // fall into an infinite loop and the game will crash!
            await ns.sleep(1000);
         }

      } else {
         ns.tprint(
            "ERROR ARGS :: "+
               "\n\targs[0]->(NUMBER || valid RAM size),"+
               "\n\targs[1]->(STRING || valid hostname)."+
               "\n\nExiting !!!"
         );
      }
   } else {
      ns.tprint('ERROR ARGS :: No arguments passed. Exiting !!!');
   }
}
