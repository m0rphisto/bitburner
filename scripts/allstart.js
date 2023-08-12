/**
 * $Id: allstart.js v0.5 2023-08-13 01:22:27 5.25GB .m0rph $
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
 *    And don't forget to adjust the threads settings due to the
 *    local RAM amount!
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
   target  = 'megacorp',
   ram =
      [
         // Self-targeting hosts ...
         'n00dles', 'foodnstuff', 'sigma-cosmetics', 'joesguns', 'hong-fang-tea', 'harakiri-sushi', 'iron-gym', 'max-hardware',
         'CSEC', 'nectar-net', 'zer0', 'silver-helix', 'phantasy', 'neo-net', 'omega-net', 'netlink', 'avmnite-02h',
         'the-hub', 'summit-uni', 'zb-institute', 'I.I.I.I', 'rothman-uni', 'catalyst', 'millenium-fitness',
         'rho-construction', 'lexo-corp', 'alpha-ent', 'aevum-police', 'global-pharm', 'omnia', 'unitalife', 'univ-energy',
         'solaris', 'microdyne', 'titan-labs', 'run4theh111z', 'fulcrumtech', 'helios', 'vitalife', 'omnitek', '.',
         'powerhouse-fitness', 'blade'
      ],
   no_ram =
      [
         // Externally attacked hosts ...
         'johnson-ortho', 'computek', 'crush-fitness', 'syscore', 'galactic-cyber', 'aerocorp', 'snap-fitness', 'deltaone',
         'defcomm', 'zeus-med', 'icarus', 'infocomm', 'nova-med', 'taiyang-digital', 'zb-def', 'applied-energetics',
         'stormtech', '4sigma', 'kuai-gong', 'b-and-a', 'nwo', 'clarkinc', 'The-Cave', 'ecorp', 'fulcrumassets',
         'megacorp'
      ];


   
   if (has_option(ns, '-l'))
   {
      ns.killall(); // At first we kill all local running scripts ...

      ram.forEach(host => {
         if (
            // ... and then we check the self-targeting hosts.
            ns.isRunning('/looper/weaken.js', host) ||
            ns.isRunning('/looper/grow.js',   host) ||
            ns.isRunning('/looper/hack.js',   host)
         ) {
            ns.tprintf(`${c.white}One of the H/G/W scripts active on ${host}. Trying to kill it ... ${ns.killall(host) ? 'OK' : 'FAILED'}.${c.reset}`);
         } 

         // Only just in case the hosts wasn't already deployed.
         if (!ns.hasRootAccess(host)) ns.run('/looper/deploy.js', 1, host);

         // Finally get them running again.
         ns.tprintf(`${c.cyan}Starting local /looper/master.js.${c.reset}`);
         ns.run('/looper/master.js', 1, host);
      });

      for (let nram of no_ram)
      {
         // Only just in case the hosts wasn't already r00ted.
         if (!ns.hasRootAccess(nram)) ns.run('/looper/deploy.js', 1, nram);
         if ( ns.hasRootAccess(nram))
         {
            // Finally get them locally running again.
            ns.tprintf(`${c.cyan}Starting local /looper/weaken.js ${nram} -t ${threads}${c.reset}`);
            ns.run('/looper/weaken.js', threads, nram);
            await ns.sleep(1000);

            ns.tprintf(`${c.cyan}Starting local /looper/grow.js ${nram} -t ${threads}${c.reset}`);
            ns.run('/looper/grow.js', threads, nram);
            await ns.sleep(1000);
      
            ns.tprintf(`${c.cyan}Starting local /looper/mhack.js ${nram} -t ${threads}${c.reset}`);
            ns.run('/looper/mhack.js', threads, nram);
            await ns.sleep(1000);
         }
      }
   }

   if (has_option(ns, '-p'))
   {
      for (let i = 0; i < 25; i++)
      {
         // Purchased server already deployed?
         if (! ns.fileExists(`/looper/weaken.js`, `pserv-${i}`)) ns.scp('/looper/weaken.js', `pserv-${i}`);
         if (! ns.fileExists(`/looper/grow.js`,   `pserv-${i}`)) ns.scp('/looper/grow.js',   `pserv-${i}`);
         if (! ns.fileExists(`/looper/hack.js`,   `pserv-${i}`)) ns.scp('/looper/hack.js',   `pserv-${i}`);
         if (! ns.fileExists(`/looper/master.js`, `pserv-${i}`)) ns.scp('/looper/master.js', `pserv-${i}`);

         // Any running scripts?
         ns.killall(`pserv-${i}`);

         // OK, starting the looper master.
         ns.tprintf(`${c.cyan}pserv-${i}: Starting /looper/master.js ${target} true${c.reset}`);
         let pid = ns.exec('/looper/master.js', `pserv-${i}`, 1, ...[target, true]);

         if (pid == 0)
         {
            ns.tprintf(`${c.red}Could not start the looper master. Exiting!!!${c.reset}`);
            ns.exit();
         }
      }
   }
}
