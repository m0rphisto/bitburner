/** 
 * $Id: bdinstall.js v0.2 2023-08-27 11:24:56 CEST 7.80GB .m0rph $
 * 
 * descripttion:
 *    Get the complete network and backdoor already nuked servers.
 * 
 * @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';
import {header, footer, trace} from '/modules/helpers.js'

export async function main(ns) {

   'use strict';

   const
      ok   = `${c.green}OK${c.reset}`,
      fail = `${c.red}FAILED${c.reset}`;

   let  network = new Set(['home']);
   network.forEach(a => ns.scan(a).forEach(b => b.match('pserv') ?? network.add(b).delete('home')));
   network.delete('w0r1d_d43m0n'); // We should NOT backdoor this one. Not yet!

   header(ns, 'si', `backdoor run started at: ${d.getdate()}, ${d.gettime()}`);

   for (let host of network)
   {
      const h = ns.getServer(host);
      let found, target, path = [];

      if (h.hasAdminRights && !h.backdoorInstalled)
      {
         ns.tprintf(`${c.white}Will now try to install backdoor on ${h.hostname} ...`);
         ns.tprintf(`${c.white}Tracing path to host ...`);
         [found, path] = trace(ns, 'home', '', h.hostname);

         while (target = path.shift())
         {
            if (target != 'home')
            {
               ns.tprintf(`${c.white}Connecting ${target} ... ${ns.singularity.connect(target) ? ok : fail}`);
               
               if (target == h.hostname)
               {
                  ns.tprintf(`${c.white}Installing backdoor ...`);
                  await ns.singularity.installBackdoor();
               }
            }
         }
         ns.tprintf(`${c.white}Returning home ... ${ns.singularity.connect('home') ? ok : fail}`);
      }
   }

   footer(ns, 'Backdoor run finished.');
}
