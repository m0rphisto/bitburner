/** 
 * filename: cleanlog.js
 * date: 2023-07-29
 * version: 0.2
 * author: .m0rph
 *    RAM: 2.80GB
 * 
 * descripttion:
 *    The logdir has to be cleaned sometimes. ;-)
 * 
 * @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';

export async function main(ns) {

   'use strict';

   let  data = `Cleanlog run started: ${d.getdate()}, ${d.gettime()}`;

   const rm_file = (file) => {
      let rm = ns.rm(file) ? 'OK' : 'FAILED';
      data = `${data}\nDeleting ${file} ... ${rm}.`;
   }

   ns.tprintf(`${c.cyan}${data}${c.reset}`);
   ns.ls('home', 'log/').forEach(rm_file);
   ns.write(`/log/cleanlog-${d.timestamp()}.js`, data, 'w');
   ns.tprintf(`${c.cyan}Run finished.${c.reset}`);
}

