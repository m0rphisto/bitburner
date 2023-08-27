/**
 * $Id: helpers.js v0.2 2023-08-27 10:47:55 1.60GB .m0rph $
 * 
 * description:
 *    A collection of little helper functions.
 */

import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';

/**
 * Error exit handler.
 * 
 * @depends '/modules/colors.js'
 * 
 * @param {NS}       ns    The Netscript API.
 * @param {string}   msg   Error message.
 */
export function exit(ns, msg = '')
{
   ns.tprintf(`${c.red}ERROR: ${msg} Exiting !!!`);
   ns.exit();
}

/**
 * Logger. Sometimes we need a grepable logfile for later analysis.
 * 
 * @depends '/modules/colors.js'
 * @depends '/modules/datetime.js'
 * 
 * @param {NS}       ns    The Netscript API.
 * @param {string}   file  The logfile. (default is /log/syslog.js)
 * @param {string}   data  The logfile entry.
 * @param {string}   mode  File open mode >> w = create new file, a = append to file. (default is 'w')
 * @param {boolean}  mode  Also write the logfile entry to the tail window? (default is false)
 */
export function log(ns, file = '/log/syslog.js', data = '', mode = 'a', tail = !!0)
{
   tail && ns.print(`${c.cyan}${data}${c.reset}`);
   ns.write(file, `[${d.gettime()}] ${data}\n`, mode);
}

/**
 * Recursive function for tracing the route to a given host.
 *
 * @param   {NS}      ns     The Netscript API.
 * @param   {string}  host   The host where the path traversal starts.
 * @param   {string}  last   The start path (last traverseal)
 * @param   {string}  target The target server we want to trace.
 * @param   {string}  path[] The path to the target server.
 * @returns {boolean} found  Found the target?
 */

export function trace(ns, host, last, target, path = [])
{
   let found = !!0;

   if (host.toLowerCase().includes(target.toLowerCase())) found = !!1;

   let fnd, hosts = ns.scan(host);

   for (let i = 0; i < hosts.length; i++)
   {
	   if (hosts[i] != last)
      {
         [fnd, path] = trace(ns, hosts[i], host, target, path);

         if (fnd) found = !!1;
      }
   }
   if (found) path.unshift(host);

   return [found, path];
}

/**
 * Script header. Gives an info about the script and the used API.
 * 
 * @depends '/modules/colors.js'
 * 
 * @param {NS}     ns  The Netscript API.
 * @param {string} api The API key.
 * @param {string} msg The API key.
 */
export function header(ns, api = 'ns', msg = '')
{
   const a = {
      'ns': 'Netscript',
      'hn': 'Hacknet',
      'si': 'Singularity'
   }
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
   ns.tprintf(`${c.cyan}> API: ${a[api]} - ${msg}`);
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
}

/**
 * Script footer. Indicates that the script run is finished.
 * 
 * description:
 *    Sometimes hidden bugs or buggy promises produce weird behavior
 *    and it then can be helpful to know that the script has already
 *    finished its run.
 * 
 * 
 * @depends '/modules/colors.js'
 * 
 * @param {NS}     ns    The Netscript API.
 * @param {string} data  The footer message.
 */
export function footer(ns, msg = undefined)
{
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
   ns.tprintf(`${c.icyan}${msg ?? 'Script run finished'}`);
}

