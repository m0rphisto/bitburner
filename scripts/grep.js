/** 
 * filename: grep.js
 * date: 2023-07-14
 * version: 0.1
 * author: .m0rph
 *    RAM: 5.25GB
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

export async function main(ns) {

   'use strict';

   const mns = {

      /**
       * Property: STDIN :: @string, cause ns.read(file) returns the file content as a string. :: File to grep.
       */
      stdin: '',

      /**
       * Property: STDOUT :: @array :: Lines that were grepped out of files.
       */
      stdout: [],

      /**
       * Property: Regular expression.
       */
      regex: '',


      /**
       * Method: Get subnet of args[*] or set it undefined.
       */
      grep: () => {

         mns.stdout = new RegExp(mns.regex).exec(mns.stdin);

         console.clear();
         console.log('mns.regex:'+mns.regex);
         console.log('mns.stdout:'+mns.stdout);
         console.log('mns.stdin: '+mns.stdin);
/*
         ns.tprintf(`${c.cyan}Start getnet run at: ${md.getdate()}, ${md.gettime()}${c.reset}`);

         //let i = 0, data = '', host, req = '###';
         let i = 0, data = '', host, req = '';

         while (host = hosts.shift()) {

            if (mns.scanned.includes(host)) {
               //req = sprintf(`${req}X###`);
               continue;
            }
            
            let line, h = ns.getServer(host);

            if (! h.purchasedByPlayer) {
               hosts = hosts.concat(mns.scan(h.hostname));
               line = sprintf(
                  //`${req} ${h.hostname}: ip(${h.ip}), hack(${h.requiredHackingSkill}), ports(${h.numOpenPortsRequired}), root(${(h.hasAdminRights)}), backdoor(${(h.backdoorInstalled)})`
                  `${h.hostname}: ip(${h.ip}), hack(${h.requiredHackingSkill}), ports(${h.numOpenPortsRequired}), root(${(h.hasAdminRights)}), backdoor(${(h.backdoorInstalled)})`
               );
               ns.tprintf(`${c.cyan}${++i}) ${line}${c.reset}`);
               data = `${data}${line}\n`;
            }
         }
         mns.log(data);
 */
      }
   };

   // At first we check the passed arguments.
   if (a.count(ns.args, 2)){
      mns.regex = a.str(ns.args[0]) ? ns.args[0] : null;
      mns.stdin = a.str(ns.args[1]) && ns.fileExists(ns.args[1]) ? ns.read(ns.args[1]) : null;
   }

   // grep the lines.
   mns.grep();

   // let's just check, if we hafe the file contents correctly loaded. 
   ns.tprintf(`${c.cyan}File: ${ns.args[1]}:\n${mns.stdout}`);

console.log('array: '+[1,2,3,4,5,6,7,8,9]);

   //mns.print(mns.scan(ma.count(ns.args, 1) ? mns.check(ns.args[0]) : ns.getHostname()));
}
