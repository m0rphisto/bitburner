/** 
 * $Id: purchtest.js v0.5 2023-09-02 23:41:39 8.15GB .m0rph $
 * 
 * description:
 *    Calculate and display how much much an upgrade or the purchase of
 *    a given number of server is.
 * 
 * Options:
 *    -p       purchase new servers
 *    -u       upgrade existing servers
 *    -r 8192  8192GB of RAM (default is 512)
 *    -c 25    Calculate for a count of 25 servers (default is 1)
 * 
 * Examples:
 *    -p -r 512 -c 15   Calculate for a count of 15 servers at a RAM size of 512GB.
 *    -u -r 512         Calculate for the upgrade of all owned servers to 1TB RAM.
 * 
 * 
 * @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {
   is_integer,
   has_option,
   get_option
} from '/modules/arguments.js';

export async function main(ns) {

   const exit = (msg) => {
      ns.tprintf(`${c.red}${msg}`);
      ns.exit();
   }

   if (! ns.args.length > 0) exit('No arguments passed.');
   if (!has_option(ns, '-p') && !has_option(ns, '-u')) exit('Purchase or upgrade? What shall we do?');

   const
      opt = has_option(ns, '-p') 
         ? 'purchase'
         : has_option(ns, '-u')
            ? 'upgrade'
            : undefined,
      ram = get_option(ns, '-r') ?? 512,
      num = get_option(ns, '-c') ?? 1;

   
   if (! opt && !is_integer(ram) && !is_integer(num)) exit(
      'ERROR ARGS :: '+
         '\n\t-r INT->(valid RAM size),'+
         '\n\t-c INT->(valid server count [optional])'+
         '\n\nExiting !!!'
   );

   const
      money = ns.formatNumber(ns.getServerMoneyAvailable('home')),
      buyed = ns.getPurchasedServers().length,
      max   = ns.getPurchasedServerLimit();
 
   const mode = {
      purchase (ram, num) {
         const cost = ns.getPurchasedServerCost(ram);
         ns.tprintf(`${c.cyan}A purchased server at ${ns.formatRam(ram)} RAM costs $${ns.formatNumber(cost)}.`);
         ns.tprintf(`${c.cyan}${num} purchased servers will cost $${ns.formatNumber(cost * num)}`);
      },
      upgrade (ram) {
         let
            cost = 0,
            pservs = new Set(['home']);
            pservs.forEach(a => ns.scan(a).forEach(b => b.match('pserv') && pservs.add(b).delete('home')));
         
         for (let pserv of pservs)
         {
            const ps = ns.getServer(pserv);
 
            if (ps.maxRam < ram)
            {
               const rc = ns.getPurchasedServerUpgradeCost(pserv, ram);
               ns.tprintf(`${c.cyan}An upgrade for ${pserv} at ${ns.formatRam(ps.maxRam)} up to ${ns.formatRam(ram)} RAM costs $${ns.formatNumber(rc)}.`);
               cost += rc;
            }
         }
         cost == 0
            ? ns.tprintf(`${c.cyan}There is no need for RAM upgrade to ${ns.formatRam(ram)}.`)
            : ns.tprintf(`${c.cyan}The complete RAM upgrade for all servers will cost $${ns.formatNumber(cost)}.`);
      }
   }

   ns.tprintf(`${c.cyan}We have $${money} available.`);
   ns.tprintf(`${c.cyan}We have buyed ${buyed != '' ? buyed : 'none'} of ${max} servers yet.`);
   mode[opt](ram, num);
}