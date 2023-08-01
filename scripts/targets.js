/** 
 * $Id: targets.js v0.6 2023-08-02 00:28:41 CEST 3.85GB .m0rph $
 * 
 * descripttion:
 *    Get the r00ted and backdoored servers and log their stats.
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
      scanned: new Set(['home']),


      /**
       * Method: Initialization of the mns object.
       */
      init () {
         this.logfile = `/log/targets-${this.timestamp}.js`;
      },

      /**
       * Method: Scan the actual subnet for hosts and remember root.
       */
      scan (hostname) {
         let host = (hostname) ? hostname : ns.getHostname();
         if (! this.scanned.has(host)) this.scanned.add(host);
         return ns.scan(host);
      },

      log (data, mode) {
         // mode: w = overwrite complete file, a = append data
         let m = (mode) ? mode : 'w';
         ns.tprintf(`${c.cyan}Writing data to logfile ${this.logfile}.${c.reset}`);
         ns.write(this.logfile, data, m);
      },

      print (hosts) {

         ns.tprintf(`${c.cyan}Start targets run at: ${d.getdate()}, ${d.gettime()}${c.reset}`);
         ns.tprintf(`${c.cyan}Note: ONLY r00ted servers !!!${c.reset}`);

         let i = 0, data = '', host;

         while (host = hosts.shift()) {

            if (this.scanned.has(host)) continue;
            
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

