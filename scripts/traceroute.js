/**
 * $Id: traceroute.js v0.1 2023-08-28 21:59:42 3.30GB .m0rph $
 * 
 * @param {NS} ns
 */
import {c} from '/modules/colors.js';
import {has_count} from '/modules/arguments.js';
import {exit, trace, header, footer} from '/modules/helpers.js';
export function autocomplete(data, args) { return [...data.servers] }
export async function main(ns) {

   has_count(ns.args, 0)       && exit(ns, 'No argument passed.');
   ns.serverExists(ns.args[0]) || exit(ns, 'Server does not exist.');

   let found, i = 0, path = [];
   [found, path] = trace(ns, 'home', '', ns.args[0]);

   header(ns, 'ns', 'traceroute');
   for (let host of path) ns.tprintf(`${c.white}${i++} ${ns.getServer(host).ip}\t${host}`);
   footer(ns, `${ns.args[0]} is ${i - 1} hops away.`);
}
