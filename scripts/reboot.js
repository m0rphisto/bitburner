/** 
 * $Id: reboot.js v0.9 2023-08-04 02:44:35 CEST 8.30GB .m0rph $
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
   function exit (msg) {
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



   // Greetings new run ...
   ns.tprintf(`${c.yellow}reboot on ${d.getdate()} at ${d.gettime()}${c.reset}`);

   let scanned  = new Set(['home']);
   const target = ns.args[0], hackit = '/scripts/hackit.js';

   scanned.forEach(a => ns.scan(a).forEach(b => scanned.add(b)));
   scanned.forEach(host => {

      if (host != 'home') {

         const h = ns.getServer(host);

         if (!h.purchasedByPlayer) {

            /**
             * Method: No purchased server; no backdoor? No admin rights? OK, let's get'em.
             */
            if (h.numOpenPortsRequired > 0 && !h.hasAdminRights) {
   
               const port_opener = ['BruteSSH', 'FTPCrack', 'HTTPWorm', 'relaySMTP', 'SQLInject'];
               const open_port   = (port) => {
   
                  if (ns.fileExists(`${port}.exe`)) {
                     try {
                        ns[port.toLowerCase()](h.hostname);
                     } catch (e) {
                        ns.tprintf(`${c.red}ERROR: ${e}${reset}`);
                     }
                  }
               };
   
               port_opener.forEach(open_port);
            }
   
            if (h.hasAdminRights) {
               ns.tprintf(`${c.cyan}${h.hostname} already r00ted.${c.reset}`);
            }
            else {
   
               if (h.openPortCount >= h.numOpenPortsRequired) {
            
                  /**
                   * We have to await the h.hasAdminRights condition !!!
                   * Otherwise reboot will walk through all hosts and do just one job,
                   * exploit it, nuke it or start hackit on it.
                   */
                  ns.nuke(h.hostname);
      
                  ns.tprintf(`${c.magenta}Did nuke() ${h.hostname}. Don't forget the backdoor !!!${c.reset}`);
               }
            }
         }
   
         if (h.hasAdminRights) {
   
            if (h.maxRam > 0) {
   
               const threads = Math.floor((h.maxRam - h.ramUsed) / ns.getScriptRam(hackit));
   
               if (! ns.fileExists(hackit, h.hostname)) {
               
                  ns.tprintf(`${c.cyan}Copying hackit to ${h.hostname} ... ${ns.scp(hackit, h.hostname) ? 'OK' : 'FAILED'}.${c.reset}`);
               } 
               
               if (threads > 0) {
                  // A little static RAM feeder. :-)
                  ns.deleteServer; // 2.25GB
                  //ns.getBitNodeMultipliers; // 4GB
                  ns.exec(hackit, h.hostname, threads, target)
                     ? ns.tprintf(`${c.green}OK, hackit is running on ${h.hostname} and hacking ${target}.${c.reset}`)
                     : ns.tprintf(`${c.red}ERROR: Could not start hackit ${h.hostname}.${c.reset}`)
               }
            }
            else {
               ns.tprintf(`${c.yellow}WARNING: ${h.hostname} doesn't have any RAM. You should do a targets() run !!!${c.reset}`);
            }
         }
      }
   });
}
