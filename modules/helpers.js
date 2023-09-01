/**
 * $Id: helpers.js v0.3 2023-09-01 08:26:24 2.50GB .m0rph $
 * 
 * description:
 *    A collection of little helper functions.
 * 
 * Note:
 *    No need to use the 'use strict'; statement here!
 *    Modules and classes are executed in strict mode
 *    by default.
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
   mode = ns.fileExists(file) ? mode : 'w';
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
      'ns': 'Netscript',            // ns
      'hn': 'Hacknet',              // hacknet
      'bb': 'Bladeburner',          // bladeburner       (SF7)
      'cc': 'CodingContract',       // codingcontract
      'co': 'Corporation',          // corporation       Extends[WarehouseAPI, OfficeAPI]
      'oa': 'OfficeAPI',            // officeapi         Requires[Office API upgrade from your corporation]
      'wa': 'Warehouse API',        // warehouseapi      Requires[Warehouse API upgrade from your corporation]
      'ga': 'Gang',                 // gang              (SF2)
      //'gf': 'GangFormulas',         // gangformulas
      //'gg': 'GangGenInfo',          // ganggeninfo
      'gr': 'Grafting',             // grafting          (SF10)
      'fo': 'Formulas',             // formulas          (Formulas.exe)
      'in': 'Infiltration',         // infiltration
      'si': 'Singularity',          // singularity       (SF4)
      'st': 'Stanek\'s Gift API',   // stanek
      'ti': 'TIX Stock Market API', // tix
      'ui': 'User Interface'        // ui
   }
   //ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
   div(ns);
   ns.tprintf(`${c.cyan}> API: ${a[api]} - ${msg}`);
   div(ns);
   //ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
}

/**
 * A visual divider.
 * 
 * @depends '/modules/colors.js'
 * 
 * @param {NS} ns The Netscript API.
 */
export function div(ns)
{
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

/**
 * A hackish way to implement shell scripting in Bitburner.  
 * Emulate terminal input.
 *
 * @param {string} cmd Run this command from the terminal.
 */

export function shell(cmd) {
    /**
     *  Template code from the official documentation of Bitburner:
     *  https://bitburner.readthedocs.io/en/latest/netscript/advancedfunctions/inject_html.html 
     */
    const input = globalThis["document"].getElementById("terminal-input");
    input.value = cmd;

    const handler = Object.keys(input)[1];

    input[handler].onChange({
        target: input,
    });
    input[handler].onKeyDown({
        key: "Enter",
        preventDefault: () => null,
    });
}