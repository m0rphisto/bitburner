/** 
 * $Id: getnet.js v0.6 2023-08-02 09:40:50 CEST 3.80GB .m0rph $
 * 
 * descripttion:
 *    First step: Get the complete network and write them to getnet.log.js.
 *   Second step: Create a JSON file. (TODO)
 * 
 * @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';

export async function main(ns) {

   'use strict';

   let  i = 0, data = '', scanned = new Set(['home']);
   const logfile = `/log/getnet-${d.timestamp()}.js`;

   ns.tprintf(`${c.cyan}Start getnet run at: ${d.getdate()}, ${d.gettime()}${c.reset}`);

   scanned.forEach(a => ns.scan(a).forEach(b => scanned.add(b)));
   scanned.forEach(host => {

      let line, h = ns.getServer(host);

      if (! h.purchasedByPlayer) {

         line = sprintf(
            `${h.hostname}: ip(${h.ip}), hack(${h.requiredHackingSkill}), ports(${h.numOpenPortsRequired}), root(${(h.hasAdminRights)}), backdoor(${(h.backdoorInstalled)})`
         );
         ns.tprintf(`${c.cyan}${++i}) ${line}${c.reset}`);
         data = `${data}${line}\n`;
      }
   });
      
   ns.tprintf(`${c.cyan}Writing data to logfile${c.reset}`);
   ns.write(logfile, data, 'w');
}
