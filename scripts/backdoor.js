/**
 * filename: backdoor.js
 *     date: 2023-07-05
 *  version: 0.1
 *   author: .m0rph
 * 
 * NOTE: Home > bitburner > Singularity
 *    This API requires Source-File 4 to use. The RAM cost of all these functions is multiplied by 16/4/1 based on Source-File 4 levels.
 * 
 * 
 * @param {NS} ns 
 * @param ns.args[0] Name of the target server to exploit in order to gain root access.
 */
export async function main(ns) {

   'use strict';

   await ns.singularity.installBackdoor();
}