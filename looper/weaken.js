/**
 * $Id: weaken.js v1.0 2023-08-31 12:55:01 CEST 1.75GB .m0rph $
 * 
 *  description:
 *    Utilized by looper/master.js.
 * 
 * @param {NS} ns The Netscript API
 */
export async function main(ns) {

   const master = JSON.parse(ns.args[0]);

   for(;;)
   {
      await ns.weaken(master.target);
      ns.writePort(ns.pid, 1);
   }
}
