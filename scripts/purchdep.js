/** 
 * Id: purchdep.js v0.1 2023-08-20 20:19:16 6.15GB .m0prh $
 * 
 * description:
 *    Deployment script for the purchased seervers.
 * 
 * 
 * @param {NS}       ns       The Netscript API.
 * @param {string}   target?  Target for the purchased servers to attack.
 *                            Optional: Default is n00dles.
 */

import {c} from '/modules/colors.js';

export async function main(ns) {

   /**
    * Error exit handler.
    * 
    * @param {string}   msg   Error message.
    */
   const exit = (msg) => {
      ns.tprintf(`${c.red}ERROR: ${msg} Exiting !!!`);
      ns.exit();
   }

   const
      master  = '/looper/master.js',
      target  = ns.args[0] ?? 'n00dles',
      hacklvl = ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(target);

   if (!ns.serverExists(target))  exit('Target does not exist.');
   if (!ns.hasRootAccess(target)) exit('Do not have root access.');
   if (!hacklvl)                  exit('Do not have required hacking Level.');

   for (let pserv of ns.getPurchasedServers())
   {
      [
         '/modules/colors.js', '/modules/datetime.js', 'modules/arguments.js',
         '/looper/weaken.js', '/looper/grow.js', '/looper/hack.js', master
      ].forEach(file => {
         if (!ns.fileExists(file, pserv))
         {
            // Deploy purchased server.
            ns.tprintf(`Copying ${file} to ${pserv}`);
            ns.scp(file, pserv);
         }
      });

      // OK, starting the looper master.
      ns.printf(`${c.cyan}${pserv}: Starting ${master} ${target} true${c.reset}`);
      let pid = ns.exec(master, pserv, 1, ...[target, true]);

      if (pid == 0)
         ns.printf(`${c.magenta}Could not start the looper master on ${pserv}.`);
   
   }
}
