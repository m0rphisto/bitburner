/** 
 * filename: grep.js
 *     date: 2023-07-15
 *  version: 0.1
 *   author: .m0rph
 *      RAM: 3.00GB
 * 
 * description:
 *    We simply need a unix grep !!!
 * 
 * @param {NS} ns
 * @param      ns.args[0]  Regular expression
 * @param      ns.args[1]  File to grep through.
 */

import {c} from '/modules/colors.js';
import {a} from '/modules/arguments.js';

export async function main(ns) {

   'use strict';

   const mns = {

      /**
       * Property: STDIN :: @string, cause ns.read(file) returns the file content as a string. :: File to grep.
       */
      stdin: '',

      /**
       * Property: STDOUT :: @array :: Lines that were grepped out of the file.
       */
      stdout: [],

      /**
       * Property: Regular expression.
       */
      regex: '',


      /**
       * Method: Get the lines that match the regular expression.
       */
      grep: () => {

         mns.stdout = new RegExp(mns.regex).exec(mns.stdin);

         console.clear();
         console.log('mns.regex:'+mns.regex);
         console.log('mns.stdout:'+mns.stdout);
         //console.log('mns.stdin: '+mns.stdin);
      }
   };

   if (a.count(ns.args, 2)){
      // At first we check the passed arguments.
      mns.regex = a.str(ns.args[0]) ? ns.args[0] : null;
      mns.stdin = a.str(ns.args[1]) && ns.fileExists(ns.args[1]) ? ns.read(ns.args[1]) : null;

      mns.grep();
      ns.tprintf(`${c.cyan}${mns.stdout}${c.reset}`);

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

