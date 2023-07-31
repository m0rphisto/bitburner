/**
 * $Id: deploy.js v0.1 2023-07-31 21:38:29 CEST 5.75GB .m0rph $
 * 
 *
 * description:
 *    The looper deployment script.
 *
 * @param   {NS}       ns         The Netscaipt API.   
 * @param   {string}   ns.args[0] Name of the target server to exploit in order to gain root access.
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';
import {a} from '/modules/arguments.js';

export function autocomplete(data, args) {
   return [...data.servers];
}
export async function main(ns) {

   'use strict';

   const mns = {

      /**
       * Method: Validate passed argument.
       * 
       * @param {string}   arg   The target server (ns.args[0])
       */
      check (arg) {
         return a.str(arg) ? ns.serverExists(arg) ? arg : this.exit('Target does not exist.') : undefined;
      },

      /**
       * Method: Initialize looper.
       * 
       * @param   {string} arg   The target server.
       */
      init (arg) {

         if (!arg) this.exit('ERROR ARGS :: String expected.');

         this.target  = arg;
         this.files   = ['/looper/hack.js', '/looper/grow.js', '/looper/weaken.js'];
         this.logfile = `/log/looper-deploy.${this.target}.${d.timestamp()}.js`;
         this.log(
            `Looper deploy startet at ${d.getdate()}, ${d.gettime()}: ` +
            `Initializing target data\.n`
         );
      },

      /**
       * Method: No backdoor? No admin rights? OK, let's get'em.
       */
      exploit () {

         const h = ns.getServer(this.target);

         if (h.numOpenPortsRequired > 0) {

            const port_opener = ['BruteSSH', 'FTPCrack', 'HTTPWorm', 'relaySMTP', 'SQLInject'];
            const open_port   = (port) => {

               if (ns.fileExists(`${port}.exe`)) {

                  let msg, opener = `ns.${port.toLowerCase()}(this.target)`;

                  try {
                     eval(opener);
                     msg = `Opening port: Executing ${port}.exe\n`;
                  }
                  catch (e) {
                     msg = `ERROR: ${e}\n`;
                     ns.tprintf(`${c.red}ERROR: ${e}${reset}`);
                  }

                  this.log(msg, 'a');
               }
            };

            port_opener.forEach(open_port);
         }

         if (h.openPortCount >= h.numOpenPortsRequired) {

            // TODO: implement terminal hack for automated backdooring.
            
            ns.nuke(this.target);
            ns.tprintf(`${c.cyan}Did nuke() ${this.target}. Don't forget the backdoor !!!${c.reset}`);
            ns.tprintf(`${c.cyan}We're ready for the looper master.${c.reset}`);
         }
         else {
            ns.tprintf(`${c.red}Cannot nuke() ${this.target}.${c.reset}`);
         }

         // And finally copy the scripts onto the target server.
         ns.scp(this.files, this.target);
      },


      /**
       * Method: Looper logger. We need a grepable logfile for later analysis.
       * 
       * @param {string}   data  Text that is written to the logfile.
       * @param {string}   mode  File open mode >> w = create new file, a = append to file.
       */
      log (data, mode) {
         const m = (mode) ? mode : 'w';
         ns.print(`${c.cyan}${data}${c.reset}`);
         ns.write(this.logfile, data, m);
      },

      /**
       * Method: Error exit handler.
       * 
       * @param {string}   msg   Error message.
       */
      exit (msg) {
         ns.tprintf(`${c.red}${msg} Exiting !!!${c.reset}`);
         ns.exit();
      }
   }

   mns.init(a.count(ns.args, 1) ? mns.check(ns.args[0]) : mns.exit('No target passed'));
   mns.exploit();
}

