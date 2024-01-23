/**
 * $Id: run-contracts.js v0.1 2023-09-06 08:21:47 8.00GB .m0rph $
 * 
 * Description:
 *  This scripts runs over the complete server network, searches for
 *  coding contracts and solves them.
 * 
 * 
 * @param {NS} ns
 */
import { c } from '/modules/colors.js';
import { header, div } from '/modules/helpers.js';
import { ctypes, get_network } from '/lib/coding-contracts.js';
export async function main(ns) {

   const
      net  = get_network(ns),
      OK   = `${c.green}OK${c.white}`,
      FAIL = `${c.red}FAIL${c.white}`;

   header(ns, 'cc', 'run-contracts.js');

   for (let host of net) {
      const cc = {}, files = ns.ls(host, '.cct');
      ns.tprintf(`${c.white}Searching coding contracts on ${host} ... ${files.length > 0 ? OK : FAIL}.`)
      if (files.length < 1) continue;
      for (const file of files) {
         const ctype = ns.codingcontract.getContractType(file, host);
         if (Object.keys(ctypes).includes(ctype)) {
            cc.file = file;
            cc.host = host;
            ns.tprintf(`${c.white}Found: ${ctype}. Solving ...`)
            await ns.run(ctypes[ctype], 1, JSON.stringify(cc));
         } else {
            ns.tprintf(`${c.magenta}Sorry, "${ctype}" not yet implemented.`)
         }
      }
      div(ns);
   }
   ns.tprintf(`${c.icyan}Coding contracts run finished`);
}