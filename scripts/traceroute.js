/**
 * $Id: traceroute.js v0.2 2023-09-31 10:31:49 3.30GB .m0rph $
 * 
 * @param {NS} ns
 */
import {c} from '/modules/colors.js';
import {has_count} from '/modules/arguments.js';
import {exit, trace, header, footer} from '/modules/helpers.js';
export function autocomplete(data) { return [...data.servers] }
export async function main(ns) {

   // This is only for ESLint keeping quiet.
   const do_nothing = () => { return }

   has_count(ns.args, 0) && exit(ns, 'No argument passed.');
   ns.serverExists(ns.args[0]) || exit(ns, 'Server does not exist.');

   let found, i = 0, path = [];
   [found, path] = trace(ns, 'home', '', ns.args[0]);

   found && do_nothing();
   header(ns, 'ns', 'traceroute');
   for (let host of path) ns.tprintf(`${c.white}${i++} ${ns.getServer(host).ip}\t${host}`);
   footer(ns, `${ns.args[0]} is ${i - 1} hops away.`);
}