/**
 * $Id: master.js v0.1 2023-07-31 19:07:37 CEST 5.45GB .m0rph $
 * 
 * Description:
 *    This is the looper master, that utilizes looper/{hack,grow,weaken}.js
 * 
 *    The looper scripts are needed during the early phase of the first level
 *    in a BitNode, when no TerraByes of RAM are available, neither on the
 *    home machine nor on purchased servers. This strategy is usable after
 *    the first RAM upgrade of the home server to 8GB.
 * 
 *    In the beginning of a BitNode a little hand work is nessecary.
 *    For that we use exploit and hackit. ;-)
 * 
 * Note:
 *    The looper scripts have to be available on the target server.
 *    We use looper/deploy.js for that in front.
 * 
 * 
 * @param {NS}       ns       The Netscript API.
 * @param {string}   target   Hostname of the target server.   (ns.args[0])
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

         this.target          = arg;

         this.pid             = 0;
         this.cmd             = '';

         this.hack            = '/looper/hack.js';
         this.grow            = '/looper/grow.js';
         this.weaken          = '/looper/weaken.js';
         this.logfile         = `/log/looper-master.${this.target}.${d.timestamp()}.js`;

         this.min_security    = ns.getServerMinSecurityLevel(this.target);
         this.max_money       = ns.getServerMaxMoney(this.target);
         this.max_ram         = ns.getServerMaxRam(this.target);

         this.weaken_thresh   = this.min_security + 1.5;
         this.money_thresh    = this.max_money    * .75;
         
         this.weaken_threads  = Math.float(this.max_ram / ns.getScriptRam(this.weaken, this.target));
         this.grow_threads    = Math.float(this.max_ram / ns.getScriptRam(this.grow,   this.target));
         this.hack_threads    = Math.float(this.max_ram / ns.getScriptRam(this.hack,   this.target));

         this.log(
            `Looper master startet at ${d.getdate()}, ${d.gettime()}: ` +
            `Initializing target data\.n`
         );
      },

      /**
       * Method: Start cmd on the target server.
       * 
       * @param   {string}    Script name that should be run.
       * @param   {string}    Number of threads.
       * @returns {boolean}   True if the scripts was started correctly, false otherwise.
       */
      start (cmd, threads) {
         
         return ns.exec(cmd, this.target, threads);
      },

      /**
       * Method: Kill the actual script on the target server.
       *
       * @returns {boolean} True if the process was killed correctly, false otherwise.
       */
      kill () {

         let retval, msg = `${d.gettime()}: Trying to kill pid(${this.pid}) ${this.cmd} ... `;

         retval = ns.kill(this.pid) ? 'OK' : 'FAILED';

         this.log(`${msg}${retval}.\n`, 'a');

         return retval == 'OK' ? true : false;
      },

      /**
       * Method: Main looper routine ...
       */
      async run () {

         let money, sec;

         function ps_helper (c, kill) {

            /**
             * Due to a redundancy we need a little helper.
             */
         
            let 
               cmd = c.toLowerCase(),
               pre = `
                  if (this.kill()) {
               `,
               start = `
                     this.cmd = this.${cmd};
                     this.pid = this.exec(this.cmd, this.target, this.${cmd}_threads);
                     this.log(\`${d.gettime()}: Started pid(\${this.pid}) \${this.cmd}.\n\`, 'a');
                     await ns.sleep(ns.get${c}Time(this.target));
               `,
               post = `
                  }
                  else {
                     this.log(\`ERROR: Could not kill pid(\${this.pid}) \${this.cmd}. Exiting !!!\`);
                     ns.exit();
                  }
               `;

            code = (kill) ? `${pre}${start}${post}` : start;

            try {
               eval(code);
            }
            catch (e) {

               this.log(`ERROR: ${e}. Exiting !!!\n`);
               ns.exit();
            }
         }

         // At the beginning we start a weaken script ...
         ps_helper('Weaken');

         for (;;) {
 
            // And then we start monitoring.

            money = ns.getServerMoneyAvailable(this.target),
            sec   = ns.getServerSecurityLevel(this.target);

            if (money >= this.money_thresh) {

               // Money threshold reached, so we hack the box.
               ps_helper('Hack', !!1); // !!1 --> Gimme the boolean TRUE.
            }
            else if (sec >= this.weaken_thresh) {

               // Too high security level, we have to weaken.
               ps_helper('Weaken', !!1);
            }
            else {

               // Otherwise grow to the max.
               ps_helper('Grow', !!1);
            }
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

   mns.init(a.count(ns.args, 1) ? mns.check(ns.args[0]) : mns.exit('No target passed'));
   mns.run();
}
