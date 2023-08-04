/**
 * $Id: deploy.js v0.4 2023-08-04 14:21:08 CEST 8.05GB .m0rph $
 * 
 *
 * description:
 *    The looper deployment script.
 *
 * Note:
 *    If one server was passed, {hack,grow,weaken}.js are copied to it and master.js runs externaly to control them.
 *    Maybe on a purchased server or the home server. If two server were passed we have to deploy a purchased server
 *    that is attacking another one. For this case, also master.js is copied to the first server.
 *
 *
 * @param   {NS}       ns          The Netscaipt API.   
 * @param   {string}   ns.args[0]  Target of attack.
 * @param   {string}   ns.args[1]? Target of looper master. Argument is optional.
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';
import {
   has_count,
   is_string
} from '/modules/arguments.js';

export function autocomplete(data, args) {
   return [...data.servers];
}

export async function main(ns) {

   'use strict';

   /**
    * Error exit handler.
    * 
    * @param {string}   msg   Error message.
    */
   function exit (msg) {
      ns.tprintf(`${c.red}ERROR: ${msg} Exiting !!!${c.reset}`);
      ns.exit();
   }
   
   /**
    * Looper logger. We need a grepable logfile for later analysis.
    * 
    * @param {string}   data  Text that is written to the logfile.
    * @param {string}   mode  File open mode >> w = create new file, a = append to file.
    */
   function log (data, mode) {
      const m = (mode) ? mode : 'w';
      ns.print(`${c.cyan}${data}${c.reset}`);
      ns.write(logfile, data, m);
   }


   /**
    * At first the parameter validation.
    */
   has_count(ns.args, 0) ? exit('No target passed') : null;

   has_count(ns.args, 1)
      ? is_string(ns.args[0]) 
         ? ns.serverExists(ns.args[0]) ? null : exit(`Attack target ${ns.args[0]} does not exist.`)
         : exit(`ERROR :: ${ns.args[0]} :: String expected.`)
      : null;

   has_count(ns.args, 2)
      ? is_string(ns.args[1]) 
         ? ns.serverExists(ns.args[1]) ? null : exit(`Master target ${ns.args[1]} does not exist.`)
         : exit(`ERROR :: ${ns.args[1]} :: String expected.`)
      : null;


   /**
    * Then the initialization section.
    */
   const
      target  = ns.args[0],
      looper  = ns.args[1] ?? undefined,
      files   = ['/looper/hack.js', '/looper/grow.js', '/looper/weaken.js', '/modules/colors.js', '/modules/arguments.js', '/modules/datetime.js'],
      logfile = `/log/looper-deploy.${target}.${d.timestamp()}.js`;

   log(
      `Looper deploy startet at ${d.getdate()}, ${d.gettime()}: ` +
      `Initializing target data.\n`
   );


   /**
    * Main routine: No backdoor? No admin rights? OK, let's get'em.
    */
   let h = ns.getServer(target);

   if (!h.purchasedByPlayer && !h.hasRootAccess) {

      if (h.numOpenPortsRequired > 0) {

         const port_opener = ['BruteSSH', 'FTPCrack', 'HTTPWorm', 'relaySMTP', 'SQLInject'];
         const open_port   = (port) => {

            if (ns.fileExists(`${port}.exe`)) {

               let msg;

               try {
                  ns[port.toLowerCase()](target);
                  msg = `Opening port: Executing ${port}.exe\n`;
               }
               catch (e) {
                  msg = `ERROR: ${e}\n`;
                  ns.tprintf(`${c.red}ERROR: ${e}${reset}`);
               }

               log(msg, 'a');
            }
         };

         port_opener.forEach(open_port);

         // After port opening we have to wait a second, because of the nuking afterwards.
         //ns.tprintf(`${c.cyan}Port opening finished, awaiting hasRootAccess status ... sleeping 5ms${c.reset}`)
         //await ns.sleep(5000);
      }

      // Refetch the server object, due to the opened ports check!
      h = ns.getServer(target);

      if (h.openPortCount >= h.numOpenPortsRequired) {
      
         ns.nuke(target);
         ns.tprintf(`${c.cyan}Did nuke() ${target}. Don't forget the backdoor !!!${c.reset}`);
         ns.tprintf(`${c.cyan}We're ready for the looper master.${c.reset}`);
         log(`Targed nuked. Don't forget the backdoor!\n`, 'a')
      }
      else {
         ns.tprintf(`${c.red}Cannot nuke() ${target}.${c.reset}`);
      }
   }

   if (looper) files.push('/looper/master.js');
   // And finally copy the scripts onto the target server.
   log(
      `Copying looper scripts ... ${ns.scp(files, looper ? looper : target) ? 'OK' : 'FAILED'}.` +
      `\nDeployment finished. ${looper ? '' : 'Exiting.'}`,
      'a'
   );

   if (looper) {
      // Deploy a pserv-N ? execute the looper master.
      ns.deleteServer; // Just a little static RAM feed3r... 2.25GB
      ns.exec('/looper/master.js', looper, 1, ...[target, true])
         ? log(`\nExecuting looper master on ${looper} to attack ${target}.`, 'a')
         : log(`\nError executing looper master on ${looper}. Exiting !!!`, 'a');
   }
}

