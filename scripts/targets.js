/** 
 * $Id: targets.js v0.7 2023-09-01 10:27:32 CEST 3.80GB .m0rph $
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

   let i = 0, data = '', scanned = new Set(['home']);
   const logfile = `/log/targets-${d.timestamp()}.js`;

   ns.tprintf(`${c.cyan}Start targets run at: ${d.getdate()}, ${d.gettime()}${c.reset}`);
   ns.tprintf(`${c.cyan}Note: ONLY r00ted servers !!!${c.reset}`);

   scanned.forEach(a => ns.scan(a).forEach(b => scanned.add(b)));
   scanned.forEach(host => {

      let line, h = ns.getServer(host);

      if (! h.purchasedByPlayer && h.hasAdminRights) {

         line = ns.sprintf(
            `${h.hostname}: ram(${ns.formatRam(h.maxRam)}), max($${ns.formatNumber(h.moneyMax)}), hack(${h.requiredHackingSkill}), growth(${h.serverGrowth}), sec(${h.minDifficulty})`
         );
                  
         ns.tprintf(`${h.maxRam == 0 ? c.red : c.cyan}${++i}) ${line}${c.reset}`);
         data = `${data}${line}\n`;
      }
   });

   ns.tprintf(`${c.cyan}Writing data to logfile ${logfile}.${c.reset}`);
   ns.write(logfile, data, 'w');
}