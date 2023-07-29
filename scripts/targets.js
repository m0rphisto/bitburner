/** 
 * filename: targets.js
 * date: 2023-07-29
 * version: 0.4
 * author: .m0rph
 *    RAM: 3.85GB
 * 
 * descripttion:
 *    Get the backdoored servers and log their stats.
 * 
 * @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';

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
       * Method: Scan the actual subnet for hosts and remember root.
       */
      scan (hostname) {
         let host = (hostname) ? hostname : ns.getHostname();
         if (! this.scanned.includes(host)) this.scanned.push(host);
         return ns.scan(host);
      },

      log (data, mode) {
         // mode: w = overwrite complete file, a = append data
         let m = (mode) ? mode : 'w';
         ns.tprintf(`${c.cyan}Writing data to logfile${c.reset}`);
         ns.write(this.logfile, data, m);
      },

      print (hosts) {

         ns.tprintf(`${c.cyan}Start targets run at: ${d.getdate()}, ${d.gettime()}${c.reset}`);
         ns.tprintf(`${c.cyan}Note: ONLY r00ted servers !!!${c.reset}`);

         let i = 0, data = '', host;

         while (host = hosts.shift()) {

            if (this.scanned.includes(host)) continue;
            
            let color, line, h = ns.getServer(host);

            if (! h.purchasedByPlayer) {

               hosts = hosts.concat(this.scan(h.hostname));

               if (h.hasAdminRights) {

                  line = sprintf(
                     `${h.hostname}: ram(${ns.formatRam(h.maxRam)}), max(\$${ns.formatNumber(h.moneyMax)}), hack(${h.requiredHackingSkill}), growth(${h.serverGrowth}), sec(${h.minDifficulty})`
                  );
                  
                  color = h.maxRam == 0 ? c.red : c.cyan;
                  ns.tprintf(`${color}${++i}) ${line}${c.reset}`);
                  data = `${data}${line}\n`;
               }
            }
         }
         this.log(data);
      }
   };

   mns.init();
   mns.print(mns.scan());
}

