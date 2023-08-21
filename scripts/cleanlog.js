/** 
 * $Id: cleanlog.js v0.3 2023-08-21 19:54:40 4.20GB .m0rph $
 * 
 * 
 * descripttion:
 *    The logdir has to be cleaned sometimes. ;.)
 * 
 * Options:
 *    -f file.type   Filter file type - e.g. to delete all getnet-timestamp.js - files.
 * 
 * 
 * @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';
import {get_option} from '/modules/arguments.js';

export async function main(ns) {

   'use strict';

   const
      files = get_option(ns, '-f') ?? '';
   let
      data = `Cleanlog run started: ${d.getdate()}, ${d.gettime()}`;

   const rm_file = (file) => {
      let rm = ns.rm(file) ? 'OK' : 'FAILED';
      data = `${data}\nDeleting ${file} ... ${rm}.`;
   }

   ns.tprintf(`${c.cyan}${data}${c.reset}`);
   ns.ls('home', `log/${files}`).forEach(rm_file);
   ns.write(`/log/cleanlog-${d.timestamp()}.js`, data, 'w');
   ns.tprintf(`${c.cyan}Run finished.${c.reset}`);
}
