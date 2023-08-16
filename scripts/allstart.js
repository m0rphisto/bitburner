/**
 * $Id: allstart.js v0.7 2023-08-14 23:11:47 5.90GB .m0rph $
 * 
 * description:
 *    Restarts all looper scripts on hacked and on purchased servers.
 * 
 * Note:
 *    This script needs two options, or it does NOTHING.
 * 
 *    -s Start server looper scripts.
 *    -p Start purchased server looper scripts.
 * 
 *    --threads   How many threads for the local looper scripts?
 *                Default is set to 512.
 * 
 * 
 * @param {NS} ns The Netscript API.
 */

import {c} from '/modules/colors.js';
import {has_option, get_option} from '/modules/arguments.js';

export async function main(ns) {

   // System crashed? OK, let it run again.

   const 
      threads = get_option(ns, '--threads') ?? 512, 
      deploy  = '/looper/deploy.js',
      master  = '/looper/master.js',
      weaken  = '/looper/weaken.js',
      grow    = '/looper/grow.js',
      mhack   = '/looper/mhack.js',
      hack    = '/looper/hack.js';

   let hosts  = new Set(['home']); // Get a complete r00ted hosts list.
   hosts.forEach(a => ns.scan(a).forEach(b => b.match('pserv') ?? hosts.add(b).delete('home')));
   hosts.delete('The-Cave');    // Has 0GB but $0 max also
   hosts.delete('darkweb');     // Has 0GB but $0 max also
   hosts.delete('w0r1d_d3m0n'); // Has 0GB but $0 max also

   
   if (has_option(ns, '-s'))
   {
      ns.killall(); // At first we kill all local running scripts, ...

      for (let host of hosts)
      {
         if (ns.getServerMaxRam(host) > 0)
         {
            // ... and then we check the self-targeting hosts.

            if (
               ns.isRunning(weaken, host, '') ||
               ns.isRunning(grow,   host, '') ||
               ns.isRunning(hack,   host, '')
            ) {
               ns.tprintf(`${c.white}One of the H/G/W scripts active on ${host}. Trying to kill it ... ${ns.killall(host) ? 'OK' : 'FAILED'}.${c.reset}`);
            } 

            // Only just in case the hosts wasn't already deployed.
            if (!ns.hasRootAccess(host)) ns.run(deploy, 1, host);
            if ( ns.hasRootAccess(host))
            {
               // Finally get them running again.
               ns.tprintf(`${c.cyan}Starting local ${master} for ${host}.${c.reset}`);
               ns.run(master, 1, host);
            }
            else
               ns.tprintf(`${c.magenta}No root access to ${host}, so not starting looper master !!!${c.reset}`);
         }
         else
         {
            // Only just in case the hosts wasn't already r00ted.
            if (!ns.hasRootAccess(host)) ns.run(deploy, 1, host);
            if ( ns.hasRootAccess(host))
            {
               // Finally get them locally running again.
               ns.tprintf(`${c.cyan}Starting local ${weaken} ${host} -t ${threads}${c.reset}`);
               ns.run(weaken, threads, host);
               await ns.sleep(1000);
   
               ns.tprintf(`${c.cyan}Starting local ${grow} ${host} -t ${threads}${c.reset}`);
               ns.run(grow, threads, host);
               await ns.sleep(1000);
         
               ns.tprintf(`${c.cyan}Starting local ${mhack} ${host} -t ${threads}${c.reset}`);
               ns.run(mhack, threads, host);
               await ns.sleep(1000);
            }
            else
               ns.tprintf(`${c.magenta}No root access to ${host}, so not starting looper master !!!${c.reset}`);
         }
      }
   }


   if (has_option(ns, '-p'))
   {
      /**
       * OK, we have 25 servers with 0.00GB RAM. We also have 25 purchased servers.
       * So we can let exactly one purchased server attack one null RAMmer. ;-)
       */
      let i = 0;
      hosts.forEach(a => ns.getServerMaxRam(a) > 0 && hosts.delete(a));
      hosts.forEach(nram => {
         [
            '/modules/colors.js', '/modules/arguments.js', '/modules/datetime.js', weaken, grow, hack, master
         ].forEach(file => {
            if (!ns.fileExists(file, `pserv-${i}`))
            {
               // Purchased server already deployed?
               ns.tprintf(`Copying ${file} to pserv-${i}`);
               ns.scp(file, `pserv-${i}`);
            }
         });

         if (ns.hasRootAccess(nram))
         {
            // Any running scripts?
            ns.killall(`pserv-${i}`);

            // OK, starting the looper master.
            ns.tprintf(`${c.cyan}pserv-${i}: Starting ${master} ${nram} true${c.reset}`);
            let pid = ns.exec(master, `pserv-${i}`, 1, ...[nram, true]);

            if (pid == 0)
               ns.tprintf(`${c.red}Could not start the looper master.${c.reset}`);
         }
         else
            ns.tprintf(`${c.magenta}No root access to ${nram}, so not starting looper master !!!${c.reset}`)
         
         i++;
      });
   }
}
