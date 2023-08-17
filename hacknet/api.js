/**
 * $Id: api.js v1.0 2023-08-17 15:35:16 5.60GB .m0prh $
 *
 * The first Hacknet script. We want to see, which API functions are present and which not.
 * at BN1x3.
 * 
 *  @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';

const timestamp = d.timestamp();
export async function main(ns) {

   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`)
   ns.tprintf(`${c.cyan}> Only available for Hacknet Servers${c.reset}`)
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`)

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // NOTAVAILABLE (BN.1x3)

   ns.tprintf(`${c.white}getCacheUpgradeCost(index, n): ${ns.formatNumber(ns.hacknet.getCacheUpgradeCost(30, 1))}${c.reset}`);
   //ns.tprintf(`${c.white}upgradeCache(index, n): ${ns.hacknet.upgradeCache(30, 1)}${c.reset}`);

   //ns.tprintf(`${c.white}getHashUpgradeLevel(upgName): ${ns.hacknet.getHashUpgradeLevel('upgradeName')}${c.reset}`); // Only for Hacknet Servers.
   ns.tprintf(`${c.white}getHashUpgrades(): ${ns.hacknet.getHashUpgrades()}${c.reset}`);
   ns.tprintf(`${c.white}getStudyMult(): ${ns.hacknet.getStudyMult()}${c.reset}`);
   ns.tprintf(`${c.white}getTrainingMult(): ${ns.hacknet.getTrainingMult()}${c.reset}`);
   ns.tprintf(`${c.white}hashCapacity(): ${ns.hacknet.hashCapacity()}${c.reset}`);
   //ns.tprintf(`${c.white}hashCost(upgName, count): ${ns.hacknet.hashCost(upgName, count)}${c.reset}`);
   ns.tprintf(`${c.white}numHashes(): ${ns.hacknet.numHashes()}${c.reset}`);
   
   
   //ns.tprintf(`${c.white}spendHashes(upgName, upgTarget, count): ${ns.hacknet.spendHashes(upgName, upgTarget, count)}${c.reset}`);

   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`)
   ns.tprintf(`${c.cyan}> Available for Hacknet Nodes${c.reset}`)
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`)
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // AVAILABLE (BN.1x3)
   
   ns.tprintf(`${c.white}numNodes(): ${ns.hacknet.numNodes()}${c.reset}`);
   ns.tprintf(`${c.white}maxNumNodes(): ${ns.hacknet.maxNumNodes()}${c.reset}`);

   
   ns.tprintf(`${c.white}getPurchaseNodeCost(): ${ns.formatNumber(ns.hacknet.getPurchaseNodeCost())}${c.reset}`);
   //ns.tprintf(`${c.white}purchaseNode(): ${ns.hacknet.purchaseNode()}${c.reset}`);
   ns.tprintf(`${c.white}purchaseNode(): ${c.reset}`);

   ns.tprintf(`${c.white}getCoreUpgradeCost(30, 1):  ${ns.formatNumber(ns.hacknet.getCoreUpgradeCost(30, 1))}${c.reset}`);
   //ns.tprintf(`${c.white}upgradeCore(index, n): ${ns.hacknet.upgradeCore(30, 1)}${c.reset}`);
   ns.tprintf(`${c.white}upgradeCore(index, n): ${c.reset}`);
   
   ns.tprintf(`${c.white}getLevelUpgradeCost(30, 1): ${ns.formatNumber(ns.hacknet.getLevelUpgradeCost(30, 1))}${c.reset}`);
   //ns.tprintf(`${c.white}upgradeLevel(index, n): ${ns.hacknet.upgradeLevel(30, 1)}${c.reset}`);
   ns.tprintf(`${c.white}upgradeLevel(index, n): ${c.reset}`);

   ns.tprintf(`${c.white}getRamUpgradeCost(30, 1): ${ns.formatNumber(ns.hacknet.getRamUpgradeCost(30, 1))}${c.reset}`);
   //ns.tprintf(`${c.white}upgradeRam(index, n): ${ns.hacknet.upgradeRam(30, 1)}${c.reset}`);
   ns.tprintf(`${c.white}upgradeRam(index, n): ${c.reset}`);
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   ns.tprintf(`${c.white}getNodeStats(index): ${ns.hacknet.getNodeStats(0)}${c.reset}`);

   const stats = ns.hacknet.getNodeStats(0);
   for (let i = 0; i < Object.keys(stats).length; i++)
   {
      let key = Object.keys(stats)[i];
      ns.tprintf(`>>> ${c.white}stats[${key}]: ${stats[key]}${c.reset}`);
   }
   ns.tprintf(`>>> ${c.yellow}stats['name']: ${stats['name']}${c.reset}`);
   ns.tprintf(`>>> ${c.yellow}stats['level']: ${stats['level']}${c.reset}`);
   ns.tprintf(`>>> ${c.yellow}stats['ram']: ${stats['ram']}${c.reset}`);
   ns.tprintf(`>>> ${c.yellow}stats['cores']: ${stats['cores']}${c.reset}`);
   ns.tprintf(`>>> ${c.yellow}stats[production]: ${ns.formatNumber(stats['production'])}`);
   ns.tprintf(`>>> ${c.yellow}stats[timeOnline]: ${ns.tFormat(stats['timeOnline'])}`);
   ns.tprintf(`>>> ${c.yellow}stats[totalProduction]: ${ns.formatNumber(stats['totalProduction'])}`);
   
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`)

   //const obj = ns;
   //for (let i = 0; i < Object.keys(obj).length; i++)
   //{
      //let key = Object.keys(obj)[i];
      //ns.tprintf(`${obj}: ${key}`)
   //}

   for (let i = 0; i < 10; i++)
   {
      if (i == 5) throw new Error(`[${timestamp}] Index is ${i}`);

      ns.tprintf(`i is: ${i}`);
   }
}
