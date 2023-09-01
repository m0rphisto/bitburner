/**
 * $Id: api.js v1.0 2023-09-01 06:14:32 5.60GB .m0rph $
 * 
 * The first Hacknet script. We want to see, which API functions are present and which not.
 * Testet at BN1x3.
 * 
 *  @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {header, div, footer} from '/modules/helpers.js';

export async function main(ns) {

   header(ns, 'hn', 'api.js');

//##############################################################################

   ns.tprintf(`${c.cyan}NOT AVAILABLE (BN.1x3)`);

   //ns.tprintf(`${c.white}upgradeCache(index, n):        ${ns.hacknet.upgradeCache(0, 1)}`);
   ns.tprintf(`${c.white}getCacheUpgradeCost(index, n): ${ns.formatNumber(ns.hacknet.getCacheUpgradeCost(0, 1))}`);
   ns.tprintf(`${c.white}getHashUpgrades():             ${ns.hacknet.getHashUpgrades()}`);

   //ns.tprintf(`${c.white}hashCost(upgName, count):               ${ns.hacknet.hashCost(upgName, count)}`);
   //ns.tprintf(`${c.white}getHashUpgradeLevel(upgName):           ${ns.hacknet.getHashUpgradeLevel('upgradeName')}`); // Only for Hacknet Servers.
   //ns.tprintf(`${c.white}spendHashes(upgName, upgTarget, count): ${ns.hacknet.spendHashes(upgName, upgTarget, count)}`);

   ns.tprintf(`${c.white}getStudyMult():    ${ns.hacknet.getStudyMult()}`);
   ns.tprintf(`${c.white}getTrainingMult(): ${ns.hacknet.getTrainingMult()}`);
   ns.tprintf(`${c.white}hashCapacity():    ${ns.hacknet.hashCapacity()}`);
   ns.tprintf(`${c.white}numHashes():       ${ns.hacknet.numHashes()}`);

//##############################################################################

   div(ns);
   ns.tprintf(`${c.cyan}AVAILABLE (BN.1x3)`);

   ns.tprintf(`${c.white}numNodes():    ${ns.hacknet.numNodes()}`);
   ns.tprintf(`${c.white}maxNumNodes(): ${ns.hacknet.maxNumNodes()}`);

   
   ns.tprintf(`${c.white}getPurchaseNodeCost():     ${ns.formatNumber(ns.hacknet.getPurchaseNodeCost())}`);
   //ns.tprintf(`${c.white}purchaseNode():            ${ns.hacknet.purchaseNode()}`);
   ns.tprintf(`${c.white}purchaseNode():        `);

   ns.tprintf(`${c.white}getCoreUpgradeCost(0, 1):  ${ns.formatNumber(ns.hacknet.getCoreUpgradeCost(0, 1))}`);
   //ns.tprintf(`${c.white}upgradeCore(index, n):     ${ns.hacknet.upgradeCore(0, 1)}`);
   ns.tprintf(`${c.white}upgradeCore(index, n):    `);
   
   ns.tprintf(`${c.white}getLevelUpgradeCost(0, 1): ${ns.formatNumber(ns.hacknet.getLevelUpgradeCost(0, 1))}`);
   //ns.tprintf(`${c.white}upgradeLevel(index, n):    ${ns.hacknet.upgradeLevel(0, 1)}`);
   ns.tprintf(`${c.white}upgradeLevel(index, n): `);

   ns.tprintf(`${c.white}getRamUpgradeCost(0, 1):   ${ns.formatNumber(ns.hacknet.getRamUpgradeCost(0, 1))}`);
   //ns.tprintf(`${c.white}upgradeRam(index, n):      ${ns.hacknet.upgradeRam(0, 1)}`);
   ns.tprintf(`${c.white}upgradeRam(index, n): `);

//##############################################################################
   
   ns.tprintf(`${c.white}getNodeStats(index): ${ns.hacknet.getNodeStats(0)}`);

   const stats = ns.hacknet.getNodeStats(0);
   for (let i = 0; i < Object.keys(stats).length; i++)
   {
      let key = Object.keys(stats)[i];
      ns.tprintf(`>>> ${c.white}stats[${key}]: ${stats[key]}`);
   }
   ns.tprintf(`>>> ${c.yellow}stats['name']: ${stats['name']}`);
   ns.tprintf(`>>> ${c.yellow}stats['level']: ${stats['level']}`);
   ns.tprintf(`>>> ${c.yellow}stats['ram']: ${stats['ram']}`);
   ns.tprintf(`>>> ${c.yellow}stats['cores']: ${stats['cores']}`);
   ns.tprintf(`>>> ${c.yellow}stats[production]: ${ns.formatNumber(stats['production'])}`);
   ns.tprintf(`>>> ${c.yellow}stats[timeOnline]: ${ns.tFormat(stats['timeOnline'])}`);
   ns.tprintf(`>>> ${c.yellow}stats[totalProduction]: ${ns.formatNumber(stats['totalProduction'])}`);
   
//##############################################################################

   div(ns);

   //const obj = ns;
   //for (let i = 0; i < Object.keys(obj).length; i++)
   //{
      //let key = Object.keys(obj)[i];
      //ns.tprintf(`${obj}: ${key}`)
   //}

   //for (let i = 0; i < 10; i++)
   //{
      //if (i == 5) throw new Error(`[${timestamp}] Index is ${i}`);

      //ns.tprintf(`i is: ${i}`);
   //}

   footer(ns);
}