/**
 * $Id: stats.js v0.1 2023-08-16 20:13:29 5.60GB .m0rph $
 * 
 * description:
 *    Table view of hacknet node statistics.
 * 
 * 
 *  @param {NS} ns
 */

import {c} from '/modules/colors.js';

export async function main(ns) {

   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`);
   ns.tprintf(`${c.cyan}> Hacknet Statistics${c.reset}`);
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`);
   ns.tprintf(`${c.white}Node Name        Level  RAM   Cores Production/sec  Production/Total${c.reset}`);

   for (let i = 0; i < ns.hacknet.numNodes(); i++)
   {
      let stats = ns.hacknet.getNodeStats(i);

      ns.tprintf(
         `${c.white}` +
         `${stats['name']}: ${i < 10 ? ' ' : ''}` +
         sprintf('%03d', ns.formatNumber(stats['level'], 0)) + '    ' +
         sprintf('%02dGB', stats['ram'])                     + '  ' +
         sprintf('%02d', stats['cores'])                     + '    $'+
         ns.formatNumber(stats['production'])                + '\t    $'+
         ns.formatNumber(stats['totalProduction']) +
         `${c.reset}`
      );
   }

   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`);
   //ns.tprintf(`${c.cyan}> Hacknet Statistics Testing${c.reset}`); let type = 'ram';
   //ns.tprintf(`${c.cyan}> ns.hacknet.getNodeStats(0)['level']: ${ns.hacknet.getNodeStats(0)[type]}${c.reset}`);
   //ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`);
}
