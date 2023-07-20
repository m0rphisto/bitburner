/** 
 * filename: reboot.js
 *     date: 2023-07-20
 *  version: 0.5
 *   author: .m0rph
 *      RAM: 7.40GB
 * 
 * description:
 *    In case of an infinite loop, respectively game crash or augment installation (soft reset)
 *    we need to restart hackit automatically !!!
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
       * Method: No backdoor? No admin rights? OK, let's get'em.
       */
      exploit: (h) => {

         if (h.numOpenPortsRequired > 0) {
            
            // Do we have to open ports?
            if (ns.fileExists('BruteSSH.exe',  'home')) { ns.brutessh(h.hostname);  }
            if (ns.fileExists('FTPCrack.exe',  'home')) { ns.ftpcrack(h.hostname);  }
            if (ns.fileExists('HTTPWorm.exe',  'home')) { ns.httpworm(h.hostname);  }
            if (ns.fileExists('relaySMTP.exe', 'home')) { ns.relaysmtp(h.hostname); }
            if (ns.fileExists('SQLInject.exe', 'home')) { ns.sqlinject(h.hostname); }
         }

         if (h.openPortCount >= h.numOpenPortsRequired) {
            
            ns.nuke(h.hostname);
            ns.tprintf(`${c.magenta}Did nuke() ${h.hostname}. Don't forget the backdoor !!!${c.reset}`);
         } else{
            ns.tprintf(`${c.red}Cannot nuke() ${h.hostname}.${c.reset}`);
         }
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
         ns.tprintf(`${c.yellow}reboot on ${d.getdate()} at ${d.gettime()}${c.reset}`);

         //we start with the hosts on our own subnet.
         const hackit    = '/scripts/hackit.js';
         const scriptram = ns.getScriptRam(hackit);
         let host, hosts = ns.scan('home');

         while (host = hosts.shift()) {

            if (mns.scanned.includes(host)) continue;
            
            let h = ns.getServer(host);

            if (! h.hasAdminRights) mns.exploit(h);
            if (! h.purchasedByPlayer) hosts = hosts.concat(mns.scan(h.hostname));
            if (  h.purchasedByPlayer || h.hasAdminRights) {

               const max = ns.getServerMaxRam(h.hostname); 

               if (max > 0) {

                  const threads = Math.floor(max / scriptram); 

                  ns.scp(hackit, h.hostname);
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