/** 
 * filename: purchase.js
 *     date: 2023-06-29
 *  version: 0.2
 *   author: .m0rph
 *      RAM: 8.60GB
 * 
 * @param {NS} ns
 *             ns.args[0]  number   RAM size
 *             ns.args[1]  number   Number of purchase run (prefix)
 *             ns.args[2]  string   Target server (MUST be a valid hostname)
 */
export async function main(ns) {

   if (ns.args.length > 0) {
      if (
         typeof ns.args[0] === 'number' && 
         typeof ns.args[1] === 'number' && 
         typeof ns.args[2] === 'string' &&
         ns.serverExists(ns.args[2])
      ) {
         const hackit    = '/scripts/hackit.js';
         const ram       = ns.args[0];
         const prefix    = ns.args[1];
         const target    = ns.args[2];
         const scriptram = ns.getScriptRam(hackit);
         const threads   = Math.floor(ram / scriptram); // Just cut the fraction ... (64.803 -> 64)
         const cost      = ns.getPurchasedServerCost(ram);
         const limit     = ns.getPurchasedServerLimit();
         const buyed     = ns.getPurchasedServers();
         
         let i = 0;
         while (i < limit && buyed != limit) {
            let money = ns.getServerMoneyAvailable('home');
            // Continously try to purchase a server until we've reached the
            // maximum amount of servers.
            if (money > cost){
               let hostname = ns.purchaseServer('pserv-' + prefix + '-' + i, ram);
               ns.scp(hackit, hostname);
               ns.exec(hackit, hostname, threads, target);
               ns.printf("SUCCESS :: Purchased %s is running and hacking %s.", hostname, target)
               ++i;
            } else {
               ns.printf('SeverCost is at %s. Not enough money!', ns.formatNumber(cost));
            }

            // We need to wait for a second, otherwise the script will
            // fall into an infinite loop and the game will crash!
            await ns.sleep(1000);
         }

      } else {
         ns.tprint(
            "ERROR ARGS :: "+
               "\n\targs[0]->(NUMBER || valid RAM size),"+
               "\n\targs[1]->(NUMBER || purchase run number)"+
               "\n\targs[2]->(STRING || valid hostname)."+
               "\n\nExiting !!!"
         );
      }
   } else {
      ns.tprint('ERROR ARGS :: No arguments passed. Exiting !!!');
   }
}