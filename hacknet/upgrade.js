/**
 * $Id: upgrade.js v0.4 2023-08-20 04:10:54 6.70GB .m0rph $
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
function log (ns, data, mode) {
   const m = mode ? mode : 'w';
   ns.print(`${c.cyan}${data}${c.reset}`);
   ns.write(`/log/hacknet.upgrade.${timestamp}.js`, data, m);
}

const sleep_time = (money) => {
   
   switch (true)
   {
      // We do not need to wait for long, if there's enough money.
      case money > 10e6:  return 3e4; // 30  sec
      case money > 100e6: return 1e4; // 10  sec
      case money > 1e9:   return 1e3; // 1   sec
      case money > 100e9: return 500; // 0.5 sec 
      default:
         return 6e4; // 1 min
   }
};
const max = {
   nodes: 30,
   level: 200, 
   ram:   64,
   cores:  16
};
async function upgrade(ns, type)
{
   'use strict';


   for (let i = 0; i < ns.hacknet.numNodes(); i++)
   {
      // For interval calculation see quacksouls comments on is_upgrade_core_ram_cache():
      // https://github.com/quacksouls/bitburner/blob/main/src/hnet.js
      let
         is_money = ns.getServerMoneyAvailable('home'),
         stats    = ns.hacknet.getNodeStats(i),
         interval = stats.level  % 30;
      
      if (stats[type] == max[type])
      {
         log(ns, `[${d.gettime()}] hacknet-node-${i}'s ${type} is at max(${stats[type]}).\n`, 'a');
      }
      else
      {
         const is_time = {
            'level' () { return !!1            },
            'ram'   () { return interval === 0 },
            'cores' () { return interval === 0 }
         };
         const cost = {
            'level' (i) { return ns.hacknet.getLevelUpgradeCost(i) },
            'ram'   (i) { return ns.hacknet.getRamUpgradeCost(i)   },
            'cores' (i) { return ns.hacknet.getCoreUpgradeCost(i)  }
         };
         const upgrade = {
            'level' (i) { return ns.hacknet.upgradeLevel(i) },
            'ram'   (i) { return ns.hacknet.upgradeRam(i)   },
            'cores' (i) { return ns.hacknet.upgradeCore(i)  }
         };
         //log(ns, `[${d.gettime()}] DEBUG - cost[${type}](i) - ${cost[type](i)}\n`, 'a');
         //log(ns, `[${d.gettime()}] DEBUG - stats[${type}] - `+stats[type]+` :: max[type] - ${max[type]}\n`, 'a');
         //log(ns, `[${d.gettime()}] DEBUG - is_time = ${is_time[type]()}\n`, 'a');

         if (is_money > cost[type](i) && stats[type] < max[type] &&  (stats.level == max.level || is_time[type]()))
         {
            if (upgrade[type](i)) log(ns, `[${d.gettime()}] ${type} upgrade - node ${i}.\n`, 'a');
            else
               throw new Error(`Could not upgrade ${type} for hacknet node ${i}`);

            await ns.sleep(sleep_time(is_money));
         }
      }
   }
}

export async function main(ns) {

   'use strict';
   
   ns.disableLog('sleep');
   ns.disableLog('getServerMoneyAvailable');

   ns.tail();

   let run = true;
   const chk = (type) => {
      
      let nodes = 0, num_nodes = ns.hacknet.numNodes();

      for (let i = 0; i < num_nodes; i++)
      {
         const stats = ns.hacknet.getNodeStats(i);
         nodes += stats[type] == max[type] ? 1 : 0;
      }

      return nodes == num_nodes ? !!1 : !!0;
   };

   while (run)
   {
      // Check if we're done and can quit.
      run = chk('level') && chk('ram') && chk('cores') ? !!0 : !!1;

      // Upgrade nodes.
      await upgrade(ns, 'level');
      await upgrade(ns, 'ram');
      await upgrade(ns, 'cores');

      //await ns.sleep(6e4);
   }
}
