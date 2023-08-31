/**
 * $Id: allstart.js v1.5 2023-08-31 16:19:48 6.40GB .m0rph $
 * 
 * description:
 *    Restarts all looper scripts on hacked and on purchased servers.
 * 
 * Note:
 *    This script needs two options, or it does NOTHING.
 * 
 *    -s Start    server looper scripts.
 *    -p Start    purchased server looper scripts.
 * 
 *    --target    The target to attack by the purchased servers,
 *                as determined by next.js. Default is n00dles.
 * 
 *    --threads   How many threads for the local looper scripts?
 *                Default is set to 512.
 * 
 * 
 * @param {NS} ns The Netscript API.
 */

import {c} from '/modules/colors.js';
import {exit, free, header, footer} from '/modules/helpers.js';
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
   ['darkweb', 'The-Cave', 'w0r1d_d43m0n'].forEach(h => hosts.delete(h)); // Have 0GB but $0 max also
   // Teporarily disabled n00dles due to looper-2 development.

   header(ns, 'ns', 'allstart run');
   
   if (has_option(ns, '-s'))
   {
      ns.killall(); // At first we kill all local running scripts, ...

      for (let host of hosts)
      {
         // Is our hacking level high enough?

         if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host))
         {
            // Only just in case the hosts wasn't already r00ted.
            if (!ns.hasRootAccess(host)) await ns.run(deploy, 1, host);
            if ( ns.hasRootAccess(host) && ns.getServerMaxMoney(host) > 0)
            {
               // BUT: We should await the deploy and master runs,
               //      or we will get confusing output.

               if (ns.getServerMaxRam(host) > 0)
               {
                  // Here the servers that can hack themselves ...

                  if (
                     ns.isRunning(weaken, host, '') ||
                     ns.isRunning(grow,   host, '') ||
                     ns.isRunning(hack,   host, '')
                  ) {
                     ns.tprintf(`${c.white}One of the H/G/W scripts active on ${host}. Trying to kill it ... ${ns.killall(host) ? 'OK' : 'FAILED'}.`);
                  } 

                  ns.tprintf(`${c.white}Starting local ${master} for ${host}.`);
                  free(ns, master) && await ns.run(master, 1, host);
               }
               else
               {
                  // ... and here the nullRAMers.

                  //ns.tprintf(`${c.white}Starting local ${weaken} ${host} -t ${threads}`);
                  //free(ns, weaken, threads) && await ns.run(weaken, threads, host);
         
                  //ns.tprintf(`${c.white}Starting local ${grow} ${host} -t ${threads}`);
                  //free(ns, grow, threads) && await ns.run(grow, threads, host);
               
                  //ns.tprintf(`${c.white}Starting local ${mhack} ${host} -t ${threads}`);
                  //free(ns, mhack, threads) && await ns.run(mhack, threads, host);

                  ns.tprintf(`${c.white}Starting local ${master} for ${host}.`);
                  free(ns, master) && await ns.run(master, 1, ...[host, true]);
               }
            }
            else
               ns.tprintf(`${c.magenta}No money or root access or to ${host}, so not starting looper master !!!`);
         }
      }
   }


   if (has_option(ns, '-p'))
   {
      const target = get_option(ns, '--target')  ?? 'n00dles';

      ns.serverExists(target) || exit(ns, "Target server doesn't exist.");

      let
         pservs = new Set(['home']);
         pservs.forEach(a => ns.scan(a).forEach(b => b.match('pserv') && pservs.add(b).delete('home')));

      for (let pserv of pservs)
      {
         [
            '/modules/colors.js', '/modules/datetime.js', '/modules/arguments.js', '/modules/helpers.js', weaken, grow, hack, master
         ].forEach(file => {
            if (!ns.fileExists(file, pserv))
            {
               // Deploy purchased server.
               ns.tprintf(`${c.white}Copying ${file} to ${pserv}`);
               ns.scp(file, pserv);
            }
         });

         // Only for safety.
         ns.killall(pserv);

         // OK, starting the looper master.
         ns.tprintf(`${c.white}${pserv}: Starting ${master} ${target} true`);
         let pid = ns.exec(master, pserv, 1, ...[target, true]);

         if (pid == 0)
            ns.tprintf(`${c.magenta}Could not start the looper master on ${pserv}.`);
      }
   }

   footer(ns, 'allstart run finished.');
}
