/**
 * $Id: deploy.js v0.2 2023-08-02 16:47:38 CEST 5.75GB .m0rph $
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
 * @param   {string}   ns.args[0]  Target of exploitation and HGW, if no second target was passed.
 * @param   {string}   ns.args[1]? Target of HGW. Argument is optional.
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
       * Method: Initialize looper.
       */
      init () {

         if (a.count(ns.args, 0)) this.exit('No target passed');

         ns.args.forEach(arg => {

            if (!a.str(arg))           this.exit(`ERROR ARGS :: ${arg} :: String expected.`);
            if (!ns.serverExists(arg)) this.exit(`Target ${arg} does not exist.`);
         });

         this.target  = ns.args[0];
         this.looper  = ns.args[1] ? ns.args[1] : undefined;
         this.files   = ['/looper/hack.js', '/looper/grow.js', '/looper/weaken.js'];
         this.logfile = `/log/looper-deploy.${this.target}.${d.timestamp()}.js`;
         this.log(
            `Looper deploy startet at ${d.getdate()}, ${d.gettime()}: ` +
            `Initializing target data.\n`
         );
      },

      /**
       * Method: No backdoor? No admin rights? OK, let's get'em.
       */
      exploit () {

         const h = ns.getServer(this.target);

         if (!h.purchasedByPlayer) {

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
            
               ns.nuke(this.target);
               ns.tprintf(`${c.cyan}Did nuke() ${this.target}. Don't forget the backdoor !!!${c.reset}`);
               ns.tprintf(`${c.cyan}We're ready for the looper master.${c.reset}`);
               this.log(`Targed nuked. Don't forget the backdoor!\n`, 'a')
            }
            else {
               ns.tprintf(`${c.red}Cannot nuke() ${this.target}.${c.reset}`);
            }
         }

         if (this.looper) this.files.push('/looper/master.js');
         // And finally copy the scripts onto the target server.
         this.log(
            `Copying looper scripts ... ${ns.scp(this.files, this.target) ? 'OK' : 'FAILED'}.` +
            `\nDeployment finished. ${this.looper ? '' : 'Exiting.'}.`,
            'a'
         );

         if (this.looper) {
            // Deploy a pserv-N ? execute the looper master.
            ns.exec('/looper/master.js', this.target, 1, ...[this.looper, true])
               ? this.log(`\nExecuting looper master on ${this.target} to attack ${this.looper}.`, 'a')
               : this.log(`\nError executing looper master on ${this.target}. Exiting !!!`, 'a');
         }
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

   mns.init();
   mns.exploit();
}

