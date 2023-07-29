/** 
 * filename: reboot.js
 *     date: 2023-07-29
 *  version: 0.6
 *   author: .m0rph
 *      RAM: 7.15GB
 * 
 * description:
 *    In case of an infinite loop, respectively game crash or augment installation (soft reset)
 *    we need to (re)start hackit automatically !!!
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
      check (arg) {
         return a.str(arg) ? ns.serverExists(arg) ? arg : this.exit('Target does not exist.') : undefined;
      },

      /**
       * Method: No backdoor? No admin rights? OK, let's get'em.
       */
      exploit (h) {

         if (h.numOpenPortsRequired > 0) {

            const port_opener = ['BruteSSH', 'FTPCrack', 'HTTPWorm', 'relaySMTP', 'SQLInject'];
            const open_port   = (port) => {

               if (ns.fileExists(`${port}.exe`)) {
                  let opener = `ns.${port.toLowerCase()}(h.hostname)`;
                  try {
                     eval(opener);
                  } catch (e) {
                     ns.tprintf(`${c.red}ERROR: ${e}${reset}`);
                  }
               }
            };

            port_opener.forEach(open_port);
         }

         if (h.openPortCount >= h.numOpenPortsRequired) {
            
            /**
             * We have to await the h.hasAdminRights condition !!!
             * Otherwise reboot will walk through all hosts and do just one job,
             * exploit it, nuke it or start hackit on it.
             */

            ns.nuke(h.hostname);
            ns.tprintf(`${c.magenta}Did nuke() ${h.hostname}. Don't forget the backdoor !!!${c.reset}`);
            ns.sleep(1000); // (is 500ms enough?)                                  |
         } else{
            ns.tprintf(`${c.red}Cannot nuke() ${h.hostname}.${c.reset}`);
         }
      },

      /**
       * Method: Scan the actual subnet for hosts and remember root.
       */
      scan (hostname) {
         let host = (hostname) ? hostname : ns.getHostname();
         if (! this.scanned.includes(host)) this.scanned.push(host);
         return ns.scan(host);
      },

      /**
       * Method: Get all servers and restart hackit on them.
       */
      run (target) {

         if (! target) this.exit('ERROR ARGS :: String expected.')

         // Greetings new run ...
         ns.tprintf(`${c.yellow}reboot on ${d.getdate()} at ${d.gettime()}${c.reset}`);

         //we start with the hosts on our own subnet.
         const hackit    = '/scripts/hackit.js';
         let host, hosts = ns.scan();

         while (host = hosts.shift()) {

            if (this.scanned.includes(host)) continue;
            
            let h = ns.getServer(host);

            if (! h.hasAdminRights) this.exploit(h);
            if (! h.purchasedByPlayer) hosts = hosts.concat(this.scan(h.hostname));
            if (  h.purchasedByPlayer || h.hasAdminRights) {

               const max = ns.getServerMaxRam(h.hostname); 

               if (max > 0) {

                  const threads = Math.floor(max / ns.getScriptRam(hackit));

                  if (! ns.fileExists(hackit, h.hostname)) {
                  
                     ns.scp(hackit, h.hostname);

                     ns.exec(hackit, h.hostname, threads, target);
                     ns.tprintf(`${c.green}OK, hackit is running on ${h.hostname} and hacking ${target}.${c.reset}`);
                  } else {
                     ns.tprintf(`${c.magenta}OK, hackit already is running on ${h.hostname} and hacking ???${c.reset}`);
                  }
               } else {
                  ns.tprintf(`${c.yellow}WARNING: ${h.hostname} doesn't have any RAM. You should do a targets() run !!!${c.reset}`);
               }
            }
         }
      },

      /**
       * Method: Error handler.
       */
      exit (msg) {
         ns.tprintf(`${c.red}${msg} Exiting !!!${c.reset}`);
         ns.exit();
      }
   };

   mns.run(a.count(ns.args, 1) ? mns.check(ns.args[0]) : mns.exit('No target passed'));
}
