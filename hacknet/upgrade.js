/**
 * $Id: upgrade.js v0.1 2023-08-17 08:13:35 6.70GB .m0rph $
 * 
 * description:
 *    Automated hacknet node upgrade process.
 * 
 *    Upgrade level, ram and cores for every of the 30 hacknet nodes
 *    until max values are reached.
 * 
 *  @param {NS} ns
 */
import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';

/**
 * Looper logger. We need a grepable logfile for later analysis.
 * 
 * @param {string}   data  Text that is written to the logfile.
 * @param {string}   mode  File open mode >> w = create new file, a = append to file.
 */
const timestamp = d.timestamp();
function log (data, mode) {
   const m = mode ? mode : 'w';
   ns.print(`${c.cyan}${data}${c.reset}`);
   ns.write(`/log/hacknet.upgrade.${timestamp}.js`, data, m);
}

const max = {
   nodes: 30,
   Level: 200, 
   Ram:   64,
   Core:  16
};
async function upgrade(ns, type)
{
   'use strict';

   for (let i = 0; i < max.nodes; i++)
   {
      // For interval calculation see quacksouls comments on is_upgrade_core_ram_cache():
      // https://github.com/quacksouls/bitburner/blob/main/src/hnet.js
      let
         interval = ns.hacknet.getNodeStats(i).level % 30,
         is_time  = interval === 0 ? !!1 : !!0;

      if (
         ns.getServerMoneyAvailable('home') > ns.hacknet[`get${type}UpgradeCost`](i, 1) &&
         ns.hacknet.getNodeStats(i)[type] < max[type] && 
         is_time
      ) {
         if (ns.hacknet[`upgrade${type}`](i)) log(`[${d.gettime()}] ${type} upgrade - node ${id}.`, 'a');
         else
            throw new Error(`Could not upgrade ${type} for hacknet node ${i}`);

         await ns.sleep(6e4)
      }
   }
}

export async function main(ns) {

   'use strict';

   ['getServerMoneyAvailable', 'sleep'].forEach(nl => ns.disableLog(nl));

   let run = true;
   const chk = (type) => {
      
      let nodes = 0;

      for (let i = 0; i < max.nodes; i++)
      {
         nodes += ns.hacknet.getNodeStats(i)[type] == max[type] ? 1 : 0;
      }

      return nodes == max.nodes ? !!1 : !!0;
   };

   while (run)
   {
      // Check if we're done and can quit.
      run = chk('Level') && chk('Ram') && chk('Core') ? !!0 : !!1;

      // Upgrade nodes.
      await upgrade('Level');
      await upgrade('Ram');
      await upgrade('Core');

      await ns.sleep(6e4);
   }
}
