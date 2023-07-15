/** 
 * filename: serverinfo.js
 *     date: 2023-07-08
 *  version: 0.3
 *   author: .m0rph
 *      RAM: 5.05GB
 * 
 * @param {NS} ns
 *             ns.args[0]  A valid hostname
 * 
 */

import {c} from '/modules/colors.js';
import {a} from '/modules/arguments.js';

export async function main(ns) {

   'use strict';

   /**
    *  At first we need a hostname !!!
    */

   let target =  (a.count(ns.args, 1) && a.str(ns.args[0])) ? ns.args[0] : undefined;

   if (target) {
      // OK, hopefully it is really a hostname.
      if (false === ns.serverExists(target)) {
         ns.tprintf(`${c.red}Server %s doesn't exist. Argument has to be a valid hostname. Exiting !!!${c.reset}`, target);
         ns.exit();
      }
   } else {
      // No one was passed, so we use this one.
      target = ns.getHostname();
   }


   /**
    * OK !!! Now we can go straight ahead !!!
    * We get the server object and print its properties to the console.
    */
	let s = ns.getServer(target);

   ns.tprint(`${c.boldyellow}\nServerInfo:${c.reset}`);
	for (let i = 0; i < Object.keys(s).length; ++i) {

	   let key   = Object.keys(s)[i];
      let value = s[key];

      if (key == 'moneyMax' || key == 'moneyAvailable') { value =  ns.formatNumber(value); }
      if (key == 'maxRam'   || key == 'ramUsed')        { value =  ns.formatRam(value);    }

	   ns.tprintf(`${c.cyan}%s: %s${c.reset}`, key, value);
   }
}