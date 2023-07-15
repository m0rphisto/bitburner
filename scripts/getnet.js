/** 
 * filename: getnet.js
 * date: 2023-07-13
 * version: 0.2
 * author: .m0rph
 *    RAM: 5.25GB
 * 
 * descripttion:
 *    First step: Get the complete network and write them to getnet.log.js.
 *   Second step: Create a JSON file.
 * 
 * @param {NS} ns
 * @param      ns.args[0]  Hostname where the subnet is to be scanned.
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';
import {a} from '/modules/arguments.js';

export async function main(ns) {

   'use strict';

   const mns = {

      /**
       * Property: Timestamp for multiple file access on the same logfile.
       */
      timestamp: d.timestamp(),

      /**
       * Property: logfile for this getnet run.
       * Note:     We have to set the timestamp AFTER initialization of the mns object!
       */
      logfile: '/log/getnet-TIMESTAMP.log.js',

      /**
       * Property: Associative array to save the complete server network, inclusive ALL subnets.
       * Example: TODO
       *    net: {
       *       home: {
       *          ipaddr: 1.2.3.4,
       *          max-money: 1234b,
       *          act-money: 1234m,
       *          min-def: 123,
       *          act-def: 123,
       *          sub: {
       *             n00dles: {},
       *             foodnstuff: {},
       *             sigma-cosmetics: {
       *                CSEC:
       *                   xxxxxxxxxxxxxxxx
       *                },
       *             },
       *             joesguns: {},
       *             hong-fang-tea: {},
       *             harakiri-sushi: {
       *                sub: {
       *                   xxxxxxxxxxxxxxxx
       *                }
       *             },
       *             ......
       *             ......
       *             ......
       *          }sub
       *       }home
       *    }net
       */
      net: {},

      /**
       * Property: Hosts, that were already root for subnet scanning. 
       */
      scanned: ['home'],


      /**
       * Method: Validate passed argument.
       */
      check: (arg) => {
         return a.str(arg) ? ns.serverExists(arg) ? arg : undefined : undefined;
      },

      /**
       * Method: Scan the actual subnet for hosts and remember root.
       */
      scan: (hostname) => {
         let host = (hostname) ? hostname : ns.getHostname();
         if (! mns.scanned.includes(host)) mns.scanned.push(host);
         return ns.scan(host);
      },

      log: (data, mode) => {
         // mode: w = overwrite complete file, a = append data
         //ns.tprintf(`${c.cyan}Writing data to: ${mns.logfile}${c.reset}`);
         let m = (mode) ? mode : 'w';
         ns.tprintf(`${c.cyan}Writing data to logfile${c.reset}`);
         ns.write(mns.logfile, data, m);
      },

      print: (hosts) => {

         ns.tprintf(`${c.cyan}Start getnet run at: ${d.getdate()}, ${d.gettime()}${c.reset}`);

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
      }
   };
   // Commented out during development.
   //mns.logfile = mns.logfile.replace(/TIMESTAMP/, mns.timestamp);

   mns.print(mns.scan(a.count(ns.args, 1) ? mns.check(ns.args[0]) : ns.getHostname()));
}
