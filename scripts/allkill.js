/** 
 * $Id: allkill.js v0.2 2023-08-09 20:31:30 CEST 2.30GB .m0rph $
 * 
 * descripttion:
 *    First step: Get the complete network.
 *   Second step: Kill all scripts on th given server.
 * 
 * Note:
 *    This script needs one option to determine wether the scripts
 *    on the purchased servers have to be killed too.
 * 
 *    -p If option passed, then the scripts on the purchased servers
 *       will be killed too, otherwise not.
 * 
 * @param {NS} ns
 */
import {has_option} from '/modules/arguments.js';
export async function main(ns) {

   'use strict';

   let  scanned = new Set(['home']);
   
   has_option(ns, '-p')
      ? scanned.forEach(a => ns.scan(a).forEach(b => scanned.add(b)))
      : scanned.forEach(a => ns.scan(a).forEach(b => b.match('pserv') ?? scanned.add(b)));

   scanned.delete('home');
   scanned.forEach(host => ns.killall(host));
}
