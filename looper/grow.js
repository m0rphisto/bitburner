/**
 * $Id: grow.js v1.0 2023-07-31 20:16:27 CEST 1.75GB .m0rph $
 * 
 * description:
 *    Utilized by looper/master.js.
 * 
 * @param {NS}       ns          The Netscript API
 * @param {string}   ns.args[0]  Hostname of the target server.
 */
export async function main(ns) {
   while(true) await ns.grow();
}
