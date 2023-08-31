/**
 * $Id: redeploy.js v1.0 2023-08-31 13:59:02 CEST 8.05GB .m0rph $
 *
 * description:
 *    The looper REdeployment script. This one is needed,
 *    when the looper scripts have changed by further
 *    development.
 *
 *
 * @param {NS} ns The Netscript API.   
 */

import {c} from '/modules/colors.js';
import {header, footer} from '/modules/helpers.js';

export async function main(ns) {

   'use strict';

   header(ns, 'ns', 'Looper redeployment script')

   const
      files  = ['/modules/helpers.js', '/looper/master.js', '/looper/hack.js', '/looper/grow.js', '/looper/weaken.js'],
      OK     = `${c.green}OK${c.reset}`,
      FAILED = `${c.red}FAILED${c.reset}`;

   let net = new Set(['home']);

   net.forEach(a => ns.scan(a).forEach(b => net.add(b).delete('home')));
   net.forEach(host => {

      for (let file of files)
      {
         if (ns.fileExists(file, host))
         {
            ns.tprintf(`${c.white}Killing all running scripts on ${host} ... ${ns.killall(host) ? OK : FAILED}${c.white}.`);
            ns.tprintf(`${c.white}Removing ${file} from ${host} ... ${ns.rm(file, host) ? OK : FAILED}${c.white}.`);
            ns.tprintf(`${c.white}Copying ${file} to ${host} ... ${ns.scp(file, host) ? OK : FAILED}${c.white}.`);
         }
      }
   });

   footer(ns);
}
