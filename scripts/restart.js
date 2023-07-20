/** 
 * filename: restart.js
 *     date: 2023-07-20
 *  version: 0.2
 *   author: .m0rph
 *      RAM: 7.80GB
 * 
 * description:
 *    In case of new analysis, sometimes we need to restart hackit with another target !!!
 * 
 * @param {NS} ns
 *             ns.args[0]  string   Hostname of target server
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';
import {a} from '/modules/arguments.js';

export function autocomplete(data, args) {
   return [...data.servers];
}

export async function main(ns) {

   'use strict';

   const mns = {

      /**
       * Property: Hosts, that were already root for subnet scanning. 
       */
      scanned: ['home'],


      /**
       * Method: Validate passed argument.
       */
      check: (arg) => {
         return a.str(arg) ? ns.serverExists(arg) ? arg : mns.exit('Target does not exist.') : undefined;
      },

      /**
       * Method: Scan the actual subnet for hosts and remember root.
       */
      scan: (hostname) => {
         let host = (hostname) ? hostname : ns.getHostname();
         if (! mns.scanned.includes(host)) mns.scanned.push(host);
         return ns.scan(host);
      },

      /**
       * Method: Get all servers and restart hackit on them.
       */
      run: (target) => {

         if (! target) mns.exit('ERROR ARGS :: String expected.')

         // Greetings new run ...
         ns.tprintf(`${c.yellow}restart run on ${d.getdate()} at ${d.gettime()}${c.reset}`);

         //we start with the hosts on our own subnet.
         const hackit    = '/scripts/hackit.js';
         const scriptram = ns.getScriptRam(hackit);
         let host, hosts = ns.scan('home');

         while (host = hosts.shift()) {

            if (mns.scanned.includes(host)) continue;
            
            let h = ns.getServer(host);

            if (! h.purchasedByPlayer) hosts = hosts.concat(mns.scan(h.hostname));
            if (  h.purchasedByPlayer || h.hasAdminRights) {

               // At first we have to check, if hackit is already running!
               let ps = ns.ps(h.hostname);

                     // DEBUG
                     //ns.tprintf(`${c.magenta}DEBUG :: typeof ps ${typeof ps}${c.reset}`);

               for (let p of ps) {

                     // DEBUG
                     //ns.tprintf(`${c.magenta}DEBUG :: ${p.filename}, pid(${p.pid}) on ${h.hostname} ...${c.reset}`);

                  if ('/'+p.filename == hackit) {

                     ns.tprintf(`${c.yellow}WARNING :: hackit with pid(${p.pid}) is running on ${h.hostname}. Trying to kill it.${c.reset}`);

                     if (ns.kill(p.pid)) { ps = null }
                     else {
                        ns.tprintf(`${c.red}ERROR :: hackit on ${h.hostname} and cannot be killed!${c.reset}`);
                     }
                  }
               }
            
               // If the target's RAM 0GB, we cannot run scripts on it.
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
      },

      /**
       * Method: Error handler.
       */
      exit: (msg) => {
         ns.tprintf(`${c.red}${msg} Exiting !!!${c.reset}`);
         ns.exit();
      }
   };

   mns.run(a.count(ns.args, 1) ? mns.check(ns.args[0]) : mns.exit('No target passed'));
}
