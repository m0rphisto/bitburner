/**
 * $Id: allstart.js 2023-08-09 20:40:15 3.90GB .m0rph $
 * 
 * description:
 *    Restarts all looper scripts on hacked and on purchased servers.
 * 
 * Note:
 *    This script needs two options, or it does NOTHING.
 * 
 *    -l Start looper scripts.
 *    -p Start purchased server scripts.
 * 
 *    And don't forget to adjust the threads settings!
 * 
 * 
 * @param {NS} ns The Netscript API.
 */

import {c} from '/modules/colors.js';
import {has_option} from '/modules/arguments.js';

export async function main(ns) {

// System crashed? OK, let it run again.

const
   threads = 512,
   pthreads = 3212,
   ram =
      [
         'n00dles', 'foodnstuff', 'sigma-cosmetics', 'joesguns', 'hong-fang-tea', 'harakiri-sushi', 'iron-gym', 'max-hardware',
         'CSEC', 'nectar-net', 'zer0', 'silver-helix', 'phantasy', 'neo-net', 'omega-net', 'netlink', 'avmnite-02h',
         'the-hub', 'summit-uni', 'zb-institute', 'I.I.I.I', 'rothman-uni', 'catalyst', 'millenium-fitness',
         'rho-construction', 'lexo-corp', 'alpha-ent', 'aevum-police', 'global-pharm', 'omnia', 'unitalife', 'univ-energy',
         'solaris', 'microdyne', 'titan-labs', 'run4theh111z', 'fulcrumtech', 'helios', 'vitalife', 'omnitek', '.',
         'powerhouse-fitness', 'blade'
      ],
   no_ram =
      [
         'johnson-ortho',
         'computek', 'crush-fitness', 'syscore', 'galactic-cyber', 'aerocorp', 'snap-fitness', 'deltaone',
         'defcomm', 'zeus-med', 'icarus', 'infocomm', 'nova-med', 'taiyang-digital', 'zb-def', 'applied-energetics',
         'stormtech', '4sigma', 'kuai-gong', 'b-and-a', 'nwo', 'clarkinc', 'The-Cave', 'ecorp', 'fulcrumassets',
         'megacorp'
      ];

   if (has_option(ns, '-l'))
   {
      ram.forEach(target => {
         ns.tprintf(`${c.cyan}Starting /looper/master.js ${target}${c.reset}`);
         ns.run('/looper/master.js', 1, target);
      });

      for (let nram of no_ram)
      {
         ns.tprintf(`${c.cyan}Starting /looper/weaken.js ${nram} -t ${threads}${c.reset}`);
         ns.run('/looper/weaken.js', threads, nram);
         await ns.sleep(1000);

         ns.tprintf(`${c.cyan}Starting /looper/grow.js ${nram} -t ${threads}${c.reset}`);
         ns.run('/looper/grow.js', threads, nram);
         await ns.sleep(1000);
      
         ns.tprintf(`${c.cyan}Starting /looper/mhack.js ${nram} -t ${threads}${c.reset}`);
         ns.run('/looper/mhack.js', threads, nram);
         await ns.sleep(1000);
      }
   }

   if (has_option(ns, '-p'))
   {
      for (let i = 0; i < 25; i++)
      {
         ns.tprintf(`${c.cyan}pserv-${i}: Starting /scripts/hackit.js ecorp -t ${pthreads}${c.reset}`);
         ns.exec('/scripts/hackit.js', `pserv-${i}`, pthreads, 'ecorp');
      }
   }
}
