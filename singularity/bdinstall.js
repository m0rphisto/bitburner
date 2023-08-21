/** 
 * $Id: bdinstall.js v0.1 2023-08-21 07:34:08 CEST 7.80GB .m0rph $
 * 
 * description:
 *    Get the complete network and backdoor already nuked servers.
 * 
 * @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';

/**
 * https://steamcommunity.com/app/1812820/discussions/0/3200369647705810506/
 * 
 * A very useful recursive function for tracing the route to a given host.
 * Found on the steam forum: original by @MrFailSauce
 */

let path = [];
const get_path = (ns, host, lasthost, target) => {

   let found = !!0;

   if (host.toLowerCase().includes(target.toLowerCase())) found = !!1;

   let hosts = ns.scan(host);

   for (let i = 0; i < hosts.length; i++)
      if (hosts[i] != lasthost)
         if (get_path(ns, hosts[i], host, target)) found = !!1;

   if (found) path.unshift(host);

   return found;
};

export async function main(ns) {

   'use strict';

   const
      ok   = `${c.green}OK${c.reset}`,
      fail = `${c.red}FAILED${c.reset}`;

   let  network = new Set(['home']);
   network.forEach(a => ns.scan(a).forEach(b => b.match('pserv') ?? network.add(b).delete('home')));
   network.delete('w0r1d_d43m0n'); // We should NOT backdoor this one. Not yet!

   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
   ns.tprintf(`${c.cyan}> API: Singularity - backdoor run started at: ${d.getdate()}, ${d.gettime()}`);
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);

   for (let host of network)
   {
      const h = ns.getServer(host);
      let target;

      if (h.hasAdminRights && !h.backdoorInstalled)
      {
         ns.tprintf('');
         ns.tprintf(`${c.white}Will now try to install backdoor on ${h.hostname} ...`);
         ns.tprintf(`${c.white}Tracing path to host ...`);
         get_path(ns, 'home', '', h.hostname);

         while (target = path.shift())
         {
            if (target != 'home')
            {
               ns.tprintf(`${c.white}Connecting ${target} ... ${ns.singularity.connect(target) ? ok : fail}`);
               
               if (target == h.hostname)
               {
                  ns.tprintf(`${c.white}Installing backdoor ....`);
                  await ns.singularity.installBackdoor();
               }
            }
         }
         ns.tprintf(`${c.white}Returning home ... ${ns.singularity.connect('home') ? ok : fail}`);
      }
   }

   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
   ns.tprintf(`${c.icyan}Backdoor run finished.`);
}
