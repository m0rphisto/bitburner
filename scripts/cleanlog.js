/** 
 * filename: cleanlog.js
 * date: 2023-07-27
 * version: 0.1
 * author: .m0rph
 *    RAM: 2.80GB
 * 
 * descripttion:
 *    The logdir has to be cleaned sometimes. ;.)
 * 
 * @param {NS} ns
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';

export async function main(ns) {

   'use strict';

   const mns = {

      /**
       * Property: Timestamp for multiple file access on the same logfile.
       */
      timestamp: d.timestamp(),

      /**
       * Property: logfile for this cleanlog run.
       * Note:     We have to set the timestamp AFTER initialization of the mns object!
       */
      logfile: '/log/cleanlog-TIMESTAMP.js',


      /**
       * Property: Logfiles that have to be deleted.
       */
      logdir: [],


      /**
       * Method: Initialization :: collect logfiles that have to be deleted an store them in an array.
       */
      init () {
         // Comment out during development.
         this.logfile = this.logfile.replace(/TIMESTAMP/, this.timestamp);
         this.logdir  = ns.ls('home', 'log/');
      },


      log (data) {
         ns.write(this.logfile, data, 'w');
      },

      clean () {
         
         this.date = d.getdate();
         this.time = d.gettime();

         ns.tprintf(`${c.cyan}Start cleanlog run at: ${this.date}, ${this.time}${c.reset}`);

         let file, data = `Cleanlog run started: ${this.date}, ${this.time}\n`;

         while (file = this.logdir.shift()) {

            let rm   = ns.rm(file) ? 'OK' : 'FAILED';

            data = `${data}Deleting ${file} ... ${rm}.\n`;
         }
         this.log(data);

         ns.tprintf(`${c.cyan}Run finished.${c.reset}`);
      }
   };

   mns.init();
   mns.clean();
}

