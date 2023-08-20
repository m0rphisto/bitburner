/** 
 * $Id: next.js v0.2 2023-08-20 17:27:36 2.25GB .m0rph $
 * 
 * description:
 *    What will be our next target?
 * 
 *    We need a server's required hacking level half of our own or lower,
 *    we need a highest possible server's max money and we need a
 *    security level as low as possible, so we calculate a weight
 *    over these facts for every single server on the network.
 * 
 *    In the end, the server with the highest weighting wins!
 * 
 * @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';

export async function main(ns) {

   'use strict';

   /**
    * Logging facility.
    */
   const log = (msg) => {
      const
         file = `/log/next-target.${d.getdate()}.js`,
         mode = ns.fileExists(file) ? 'a' : 'w';

      ns.write(file, `${d.gettime()}: ${msg}\n`, mode);
   }


   let target, register = 0, t = new Set(['home']);

   t.forEach(a => ns.scan(a).forEach(b => b.match('pserv') ?? t.add(b).delete('home')));
   t.forEach(a => {
      const 
         weight = 
         (
            ns.getHackingLevel() * 0.5 >= ns.getServerRequiredHackingLevel(a) ? ns.getHackingLevel() : 0
         ) 
         * ns.getServerMaxMoney(a) / (ns.getServerMinSecurityLevel(a) + 1);

      target   = register < weight ? a      : target,
      register = register < weight ? weight : register;

   });

   ns.tprintf(`${c.white}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
   ns.tprintf(`${c.white}> NEXT TARGET: ${c.cyan}${target}${c.reset}`);
   ns.tprintf(`${c.white}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
   
   log(`${target}`);
}
