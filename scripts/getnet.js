/** 
 * filename: getnet.js
 * date: 2023-07-29
 * version: 0.3
 * author: .m0rph
 *    RAM: 5.25GB
 * 
 * descripttion:
 *    First step: Get the complete network and write them to getnet.log.js.
 *   Second step: Create a JSON file.
 * 
 * @param {NS} ns
 * @param      ns.args[0]  Hostname where the subnet is to be scanned.
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';
import {a} from '/modules/arguments.js';

export async function main(ns) {

   'use strict';

   const mns = {

      /**
       * Property: Timestamp for multiple file access on the same logfile.
       */
      timestamp: d.timestamp(),

      /**
       * Property: Hosts, that were already root for subnet scanning. 
       */
      scanned: ['home'],


      /**
       * Method: Initialization of the mns object.
       */
      init () {
         this.logfile = `/log/getnet-${this.timestamp}.js`;
      },

      /**
       * Method: Validate passed argument.
       */
      check (arg) {
         return a.str(arg) ? ns.serverExists(arg) ? arg : undefined : undefined;
      },

      /**
       * Method: Scan the actual subnet for hosts and remember root.
       */
      scan (hostname) {
         let host = (hostname) ? hostname : ns.getHostname();
         if (! this.scanned.includes(host)) this.scanned.push(host);
         return ns.scan(host);
      },

      log (data, mode) {
         let m = (mode) ? mode : 'w';
         ns.tprintf(`${c.cyan}Writing data to logfile${c.reset}`);
         ns.write(this.logfile, data, m);
      },

      print (hosts) {

         ns.tprintf(`${c.cyan}Start getnet run at: ${d.getdate()}, ${d.gettime()}${c.reset}`);

         let i = 0, data = '', host, req = '';

         while (host = hosts.shift()) {

            if (this.scanned.includes(host))  continue;
            
            let line, h = ns.getServer(host);

            if (! h.purchasedByPlayer) {
               hosts = hosts.concat(this.scan(h.hostname));
               line = sprintf(
                  `${h.hostname}: ip(${h.ip}), hack(${h.requiredHackingSkill}), ports(${h.numOpenPortsRequired}), root(${(h.hasAdminRights)}), backdoor(${(h.backdoorInstalled)})`
               );
               ns.tprintf(`${c.cyan}${++i}) ${line}${c.reset}`);
               data = `${data}${line}\n`;
            }
         }
         this.log(data);
      }
   };

   mns.init();
   mns.print(mns.scan(a.count(ns.args, 1) ? mns.check(ns.args[0]) : ns.getHostname()));
}

