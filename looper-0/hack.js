/**
 * $Id: hack.js v1.0 2023-08-02 13:39:19 CEST 1.75GB .m0rph $
 *  
 * description:
 *    Utilized by looper/master.js.
 * 
 * @param {NS}       ns          The Netscript API
 */
export async function main(ns) {
   while(true) await ns.hack(ns.args[0] ? ns.args[0] : ns.getHostname());
}
