/**
 * $Id: grow.js v1.0 2023-08-01 23:51:51 CEST 1.80GB .m0rph $
 * 
 * description:
 *    Utilized by looper/master.js.
 * 
 * @param {NS}       ns          The Netscript API
 * @param {string}   ns.args[0]  Hostname of the target server.
 */
export async function main(ns) {
   while(true) await ns.grow(ns.getHostname());
}
