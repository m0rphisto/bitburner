/** 
 * filename: grep.js
 *     date: 2023-07-20
 *  version: 0.3
 *   author: .m0rph
 *      RAM: 3.00GB
 * 
 * descripttion:
 *    We simply need a unix grep !!!
 * 
 * @param {NS} ns
 * @param      ns.args[0]  Regular expression
 * @param      ns.args[1]  File to grep through.
 */

import {c} from '/modules/colors.js';
import {a} from '/modules/arguments.js';

export function autocomplete(data, args) {
   return [...data.servers];
}

export async function main(ns) {

   'use strict';

   const mns = {

      /**
       * Property: @array :: Cause ns.read(file) returns the file content as a string. (File to grep through)
       */
      stdin: [],

      /**
       * Property: @array :: Lines that were grepped out of the file.
       */
      stdout: [],

      /**
       * Property: $string :: Passed regular expression.
       */
      regex: '',

      /**
       * Method: OK, so we need a page loader and later do a simple regex.test() on ONE LINE
       *         of the loaded file, cause a browser's JavaScript engine is not smart
       *         enough for hungry regular expressions. >> laughable <<
       *         (Tested on Chrome's V8 and Steam)
       * 
       * So: RexExp.exec() fills RAM on stdin =~ /^(n00dles|ecorp|\.):.*$/
       *     File to grep through was /log/getnet-TIMESTAMP.log.js
       */
      load: (str) => {

         let k = 0;
         for (let i = 0; i < str.length; i++) {

            let char = str.charAt(i);

            if (char == "\n") { // Whoops, we found a line feed.

               k++;

               continue;
            }
            mns.stdin[k] = sprintf(`${(mns.stdin[k]) ? mns.stdin[k] : ''}${char}`);
         }
      },

      /**
       * Method: Get the lines that match the regular expression.
       */
      grep: () => {

         //k = 0;
         let stdin = '',
             regex = new RegExp(mns.regex);
         while (stdin = mns.stdin.shift()) {
            if (regex.test(stdin)) mns.stdout.push(stdin);
         }
      }
   };

   if (a.count(ns.args, 2)) {

      // At first we check the passed arguments.
      mns.regex = a.str(ns.args[0]) ? ns.args[0] : null;

      if (mns.regex) {

         // Then we load the file contents.
         if (a.str(ns.args[1]) && ns.fileExists(ns.args[1])) mns.load(ns.read(ns.args[1]));

         // And finally grep() !!!
         mns.grep();
         if (mns.stdout) {
            for (let stdout of mns.stdout) ns.tprintf(`${c.cyan}${stdout}${c.reset}`);
         }
      }

   } else {
      ns.tprintf(`${c.red}`+
         'ERROR ARGS :: '+
            "\n\targs[0]->(STRING || regular expression),"+
            "\n\targs[1]->(STRING || valid file name)"+
            "\n\nExiting !!!"+
            `${c.reset}`
      );
   }
}

