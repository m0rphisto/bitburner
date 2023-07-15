/** 
 * filename: restart.js
 *     date: 2023-07-15
 *  version: 0.2
 *   author: .m0rph
 *      RAM: 2.90GB
 * 
 * description:
 *    In case of an infinite loop, respectively game crash or augment installation (soft reset)
 *    we need to restart hackit automatically !!!
 * 
 * @param {NS} ns
 *             ns.args[0]  string   Hostname of target server
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';

export async function main(ns) {

   // Greetings new run ...
   ns.tprintf(`${c.yellow}restart run on ${d.getdate()} at ${d.gettime()}${c.reset}`);

   //we start with the hosts on our own subnet.
   let target, hackit = '/scripts/hackit.js', net = ns.scan('home');


   while (target = net.shift()) {

      ns.tprintf(`${c.yellow}Exploiting ${target} ...${c.reset}`);

      const ports = ns.getServerNumPortsRequired(target); // Open ports required to successfully NUKE the target.

      if (ports > 0) {
         // Do we have to open ports?
         if (ns.fileExists('BruteSSH.exe',  'home')) { ns.brutessh(target)  }
         if (ns.fileExists('FTPCrack.exe',  'home')) { ns.ftpcrack(target)  }
         if (ns.fileExists('HTTPWorm.exe',  'home')) { ns.httpworm(target)  }
         if (ns.fileExists('relaySMTP.exe', 'home')) { ns.relaysmtp(target) }
         if (ns.fileExists('SQLInject.exe', 'home')) { ns.sqlinject(target) }
      }

      ns.scp(hackit, target);
      ns.nuke(target);

      ns.tprint(`${c.green}\t${target} nuked and hackit.js copied.${c.reset}`);
   }
   ns.tprint(`${c.green}Don't forget the backdoors. Exiting !!!${c.reset}`);
}
