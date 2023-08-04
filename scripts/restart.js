/** 
 * $Id: restart.js v0.4 2023-08-04 16:49:02 CEST 7.80GB .m0rph $
 * 
 * description:
 *    In case of new analysis, sometimes we need to restart hackit with another target !!!
 * 
 * @param {NS} ns
 *             ns.args[0]  string   Hostname of target server
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';
import {
   has_count,
   is_string
} from '/modules/arguments.js';

export function autocomplete(data, args) {
   return [...data.servers];
}

export async function main(ns) {

   'use strict';

   /**
    * Error exit handler.
    * 
    * @param {string}   msg   Error message.
    */
   const exit = (msg) => {
      ns.tprintf(`${c.red}ERROR: ${msg} Exiting !!!${c.reset}`);
      ns.exit();
   }


   /**
    * At first the parameter validation.
    */
   has_count(ns.args, 0) ? exit('No target passed') : null;

   has_count(ns.args, 1)
      ? is_string(ns.args[0]) 
         ? ns.serverExists(ns.args[0]) ? null : exit(`Target ${ns.args[0]} does not exist.`)
         : exit(`ERROR :: ${ns.args[0]} :: String expected.`)
      : null;

   const 
      target    = ns.args[0],

      hackit    = '/scripts/hackit.js',
      scriptram = ns.getScriptRam(hackit);

   
   // Greetings new run ...
   ns.tprintf(`${c.yellow}restart run on ${d.getdate()} at ${d.gettime()}${c.reset}`);

   let scanned = new Set(['home']);
   scanned.forEach((a,i,sa) => ns.scan(a).forEach(b => sa.add(b))); // set.forEach((element,element-key,set) => callback)
   scanned.forEach(host => {

      if (host != 'home') {

         const h = ns.getServer(host);

         if (h.purchasedByPlayer || h.hasAdminRights) {

            // At first we have to check, if hackit is already running!
            let ps = ns.ps(h.hostname);

            for (let p of ps) {

               if ('/'+p.filename == hackit) {

                  ns.tprintf(`${c.yellow}WARNING :: hackit with pid(${p.pid}) is running on ${h.hostname}. Trying to kill it.${c.reset}`);

                  if (ns.kill(p.pid)) { ps = null }
                  else {
                     ns.tprintf(`${c.red}ERROR :: hackit on ${h.hostname} and cannot be killed!${c.reset}`);
                  }
               }
            }

            // If the target's RAM is 0GB, we cannot run scripts on it.
            const max = ns.getServerMaxRam(h.hostname); 

            if (max > 0 && !ps) {

               const threads = Math.floor(max / scriptram); 

               if (! ns.fileExists(hackit, h.hostname))
                  ns.scp( hackit, h.hostname);
                  ns.exec(hackit, h.hostname, threads, target);

               ns.tprintf(`${c.green}SUCCESS :: hackit is running on ${h.hostname} and hacking ${target}${c.reset}`);
            }
         }
      }
   });
}
