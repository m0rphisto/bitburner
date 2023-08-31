/**
 * $Id: hack.js v1.0 2023-08-31 12:56:53 CEST 1.70GB .m0rph $
 *  
 * description:
 *    Utilized by looper/master.js.
 * 
 * @param {NS} ns The Netscript API
 */
export async function main(ns) {
   
   const master = JSON.parse(ns.args[0]);

   while(true)
   {
      await ns.hack(master.target);
      ns.writePort(ns.pid, 1);
   }
}
