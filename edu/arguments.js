/**
 * $Id: arguments.js v0.1 2023-08-07 19:57:54 3.00GB .m0rph $
 * 
 * We want to see how the arguments can be passed to the script.
 * We need to be able to pass an array from the command line.
 * Or maybe parse an ini-file.
 * 
 * @param {NS} ns The Netscript API.
 */

import {
   has_option,
   get_option,
   get_list,
   parse_ini
} from '/modules/arguments.js'

export async function main(ns) {

   'use strict';

   ns.tprintf('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

   let i = 0;
   ns.tprintf(`typeof ns.args[0]: ${typeof ns.args[0]}`);
   ns.tprintf(`ns.args.length: ${ns.args.length}`);
   ns.args.forEach(a => ns.tprintf(`ns.args[${i++}]: ${a}`));

   ns.tprintf('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

   /**
    *  Testing of the new /modules/arguments.js function parse_options...
    */

   ns.tprintf(`Option "-p" passed: ${has_option(ns, '-p')}`);
   // We have a simple option that also can be used as an input option.
   has_option(ns, '-p')
      ? ns.tprintf(`option: ${get_option(ns, '-p')}`)
      : null;

   ns.tprintf('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

   ns.tprintf(`Option "--list" passed: ${has_option(ns, '--list')}`);
   // We have a whitespace separated server list
   if (has_option(ns, '--list'))
   {
      i = 0;

      // That's quite cool! ECMAScript is also able to chain declared functions,
      // respectively arrow function expressions to methods of the standard Array()
      // object and treat them as the returned array.
      
      get_list(ns, '--list').forEach(s => ns.tprintf(`pserv[${++i}]: ${s}`));
   }

   ns.tprintf(
      `OK, unfortunately the option list terminator '--' does not work.\n` +
      `Seems like Bitburner is parsing it out. :-S`
   );


   // Or we need to be able to get targets from an ini file.
   ns.tprintf('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
   ns.tprintf('> And here comes the icing on the cake. An inifile parser.');
   ns.tprintf('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

   let inifile = {};
   if (has_option(ns, '-i'))
   {
      if (inifile = parse_ini(ns))
      {
         for (let i = 0; i < Object.keys(inifile).length; i++)
         {
            let key = Object.keys(inifile)[i];
            ns.tprintf(`inifile(${get_option(ns, '-i')}): ${key}=${inifile[key]}`);
         }
      }
      else
         ns.tprintf(`Whoops, passed inifile does not exist.`);
   }
   else
   {
      ns.tprintf(`No inifile passed ...`);
   }

   ns.tprintf('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
}
