/**
 * $Id: mystats.js v1.0 2023-08-27 08:51:39 2.10GB .m0rph $
 * 
 * description:
 *    Sometimes we have to make decisions wether to join a faction, start
 *    a company job or whatever and need a little info for that.
 * 
 * 
 * @param {NS} ns
 */
import {c} from '/modules/colors.js';
export async function main(ns) {
   const me = ns.getPlayer();
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
   ns.tprintf(`${c.cyan}> API: Netscripts - player stats via ns.getPlayer()`);
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
   ns.tprintf(`${c.cyan}>`);
   ns.tprintf(`${c.cyan}> ${c.white}Player skills`);
   ns.tprintf(`${c.cyan}> ${c.white}`);
   ns.tprintf(`${c.cyan}> ${c.white}           Hack: ${ns.formatNumber(me.skills.hacking)}`);
   ns.tprintf(`${c.cyan}> ${c.white}       Strength: ${ns.formatNumber(me.skills.strength)}`);
   ns.tprintf(`${c.cyan}> ${c.white}        Defense: ${ns.formatNumber(me.skills.defense)}`);
   ns.tprintf(`${c.cyan}> ${c.white}      Dexterity: ${ns.formatNumber(me.skills.dexterity)}`);
   ns.tprintf(`${c.cyan}> ${c.white}        Agility: ${ns.formatNumber(me.skills.agility)}`);
   ns.tprintf(`${c.cyan}> ${c.white}       Charisma: ${ns.formatNumber(me.skills.charisma)}`);
   ns.tprintf(`${c.cyan}>`);
   ns.tprintf(`${c.cyan}> ${c.white}   Intelligence: ${ns.formatNumber(me.skills.intelligence)}`);
   ns.tprintf(`${c.cyan}>`);
   ns.tprintf(`${c.cyan}> -------------------------------------------------------------------------------${c.white}`);
   ns.tprintf(`${c.cyan}>`);
   ns.tprintf(`${c.cyan}> ${c.white}Health Points`);
   ns.tprintf(`${c.cyan}>`);
   ns.tprintf(`${c.cyan}> ${c.white}   Current: ${ns.formatNumber(me.hp.current)}`);
   ns.tprintf(`${c.cyan}> ${c.white}       Max: ${ns.formatNumber(me.hp.max)}`);
   ns.tprintf(`${c.cyan}>`);
   ns.tprintf(`${c.cyan}> -------------------------------------------------------------------------------${c.white}`);
   ns.tprintf(`${c.cyan}>`);
   ns.tprintf(`${c.cyan}> ${c.white}Multipliers`);
   ns.tprintf(`${c.cyan}>`);
   ns.tprintf(`${c.cyan}> ${c.white}         Agility Experience: ${ns.formatNumber(me.mults.agility_exp)}`);
   ns.tprintf(`${c.cyan}> ${c.white}                    Agility: ${ns.formatNumber(me.mults.agility)}`);
   ns.tprintf(`${c.cyan}> ${c.white}       Bladeburner Analysis: ${ns.formatNumber(me.mults.bladeburner_analysis)}`);
   ns.tprintf(`${c.cyan}> ${c.white}    Bladeburner Max Stamina: ${ns.formatNumber(me.mults.bladeburner_max_stamina)}`);
   ns.tprintf(`${c.cyan}> ${c.white}   Bladeburner Stamina Gain: ${ns.formatNumber(me.mults.bladeburner_stamina_gain)}`);
   ns.tprintf(`${c.cyan}> ${c.white} Bladeburner Success Chance: ${ns.formatNumber(me.mults.bladeburner_success_chance)}`);
   ns.tprintf(`${c.cyan}> ${c.white}        Charisma Experience: ${ns.formatNumber(me.mults.charisma_exp)}`);
   ns.tprintf(`${c.cyan}> ${c.white}                   Charisma: ${ns.formatNumber(me.mults.charisma)}`);
   ns.tprintf(`${c.cyan}> ${c.white}         Company Reputation: ${ns.formatNumber(me.mults.company_rep)}`);
   ns.tprintf(`${c.cyan}> ${c.white}                Crime Money: ${ns.formatNumber(me.mults.crime_money)}`);
   ns.tprintf(`${c.cyan}> ${c.white}              Crime Success: ${ns.formatNumber(me.mults.crime_success)}`);
   ns.tprintf(`${c.cyan}> ${c.white}         Defense Experience: ${ns.formatNumber(me.mults.defense_exp)}`);
   ns.tprintf(`${c.cyan}> ${c.white}                    Defense: ${ns.formatNumber(me.mults.defense)}`);
   ns.tprintf(`${c.cyan}> ${c.white}       Dexterity Experience: ${ns.formatNumber(me.mults.dexterity_exp)}`);
   ns.tprintf(`${c.cyan}> ${c.white}                  Dexterity: ${ns.formatNumber(me.mults.dexterity)}`);
   ns.tprintf(`${c.cyan}> ${c.white}                Faction Rep: ${ns.formatNumber(me.mults.faction_rep)}`);
   ns.tprintf(`${c.cyan}> ${c.white}             Hacking Chance: ${ns.formatNumber(me.mults.hacking_chance)}`);
   ns.tprintf(`${c.cyan}> ${c.white}         Hacking Experience: ${ns.formatNumber(me.mults.hacking_exp)}`);
   ns.tprintf(`${c.cyan}> ${c.white}               Hacking Grow: ${ns.formatNumber(me.mults.hacking_grow)}`);
   ns.tprintf(`${c.cyan}> ${c.white}              Hacking Money: ${ns.formatNumber(me.mults.hacking_money)}`);
   ns.tprintf(`${c.cyan}> ${c.white}              Hacking Speed: ${ns.formatNumber(me.mults.hacking_speed)}`);
   ns.tprintf(`${c.cyan}> ${c.white}                    Hacking: ${ns.formatNumber(me.mults.hacking)}`);
   ns.tprintf(`${c.cyan}> ${c.white}     Hacknet Node Core Cost: ${ns.formatNumber(me.mults.hacknet_node_core_cost)}`);
   ns.tprintf(`${c.cyan}> ${c.white}    Hacknet Node Level Cost: ${ns.formatNumber(me.mults.hacknet_node_level_cost)}`);
   ns.tprintf(`${c.cyan}> ${c.white}         Hacknet Node Money: ${ns.formatNumber(me.mults.hacknet_node_money)}`);
   ns.tprintf(`${c.cyan}> ${c.white} Hacknet Node Purchase Cost: ${ns.formatNumber(me.mults.hacknet_node_purchase_cost)}`);
   ns.tprintf(`${c.cyan}> ${c.white}      Hacknet Node Ram Cost: ${ns.formatNumber(me.mults.hacknet_node_ram_cost)}`);
   ns.tprintf(`${c.cyan}> ${c.white}        Strength Experience: ${ns.formatNumber(me.mults.strength_exp)}`);
   ns.tprintf(`${c.cyan}> ${c.white}                   Strength: ${ns.formatNumber(me.mults.strength)}`);
   ns.tprintf(`${c.cyan}> ${c.white}                 Work Money: ${ns.formatNumber(me.mults.work_money)}`);
   ns.tprintf(`${c.cyan}>`);
   ns.tprintf(`${c.cyan}> -------------------------------------------------------------------------------${c.white}`);
   ns.tprintf(`${c.cyan}> ${c.white}We have ${ns.formatNumber(me.numPeopleKilled)} people killed.`);
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
   ns.tprintf(`${c.icyan}Player stats run finished.`);
}
