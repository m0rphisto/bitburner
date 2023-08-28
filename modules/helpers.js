/**
  * $Id: helpers.js v0.2 2023-08-28 07:55:23 2.10GB .m0rph $
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
 * How many free RAM do we have, to run a script?
 * 
 * @depends '/modules/colors.js'
 * 
 * @param   {NS}      ns      The Netscript API.
 * @param   {string}  script  The that should be run.
 * @param   {integer} threads The thread multiplier. (default: 1)
 * @param   {string}  server  The server on which the script to run. (default: home)
 * @returns {boolean} Enough  RAM available? 
 */
export function free(ns, script, threads = 1, server = 'home')
{
   if (! ns.fileExists(script, server))
   {
      ns.tprintf(`${c.red}[ERROR] ${script} does not exist.`);
      return !!0;
   }
   if (ns.getScriptRam(script, server) * threads > ns.getServerMaxRam(server) - ns.getServerUsedRam(server))
   {
      ns.tprintf(`${c.magenta}Sorry, we need more free RAM. Cannot start ${script} !!!`);
      return !!0;
   }

   return !!1;
}


/**
 * Get the next target for attacks.
 *
 * @depends '/modules/colors.js'
 *
 * @param   {NS}     ns       The Netscript API.
 * @returns {string} target   The next target
 */
export function get_next(ns)
{
   let target, register = 0, t = new Set(['home']);

   t.forEach(a => ns.scan(a).forEach(b => b.match('pserv') ?? t.add(b).delete('home')));
   t.forEach(a => {

      if (ns.hasRootAccess(a))
      {
         // We only need to check, if we're root.

         if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(a) || ns.hasRootAccess(a))
         {
            const
               hack_lvl_need = ns.getHackingLevel() * 0.5 >= ns.getServerRequiredHackingLevel(a),
               hack_factor   = ns.getServerMaxMoney(a) / (ns.getServerMinSecurityLevel(a) + 1),
               weight = (hack_lvl_need ? ns.getHackingLevel() : 0) * hack_factor;

            target   = register < weight ? a      : target,
            register = register < weight ? weight : register;
         }
      }
   });
   return target;
}

 
/**
 * Script header. Gives an info about the script and the used API.
 * 
 * @depends '/modules/colors.js'
 * 
 * @param {NS}     ns  The Netscript API.
 * @param {string} api The API key.
 * @param {string} msg The header message.
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

