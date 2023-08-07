/** 
 * $Id: arguments.js v0.3 2023-08-07 20:09:28 CEST 3.00GB .m0rph $
 * 
 * descripttion:
 *    Module for argument handling on ns.args[*].
 */

/**
 ** For newer versions
 * @param   {array}  args  ns.args array.
 * @param   {number} c     How much arguments should have been passed?
 */
export function has_count(args, c) {
   return args.length === c ? true : false;
}

/** @param {number} arg  Numeric value passed? */
export function is_number(arg) {
   return typeof arg === 'number' ? true : false;
}

/** @param {string} arg  String passed? */
export function is_string(arg) {
   return typeof arg === 'string' ? true : false;
}

/** @param {boolean} arg  Boolean value passed? */
export function is_boolean(arg) {
   return typeof arg === 'boolean' ? true : false;
}

/** @param {string} arg  Regular expression passed? */
export function is_RegEx(arg) {
   return new RegExp(/\/.*\//).exec(arg) ? true : false;
}

/** @param {number} arg  Integer value passed? */
export function is_integer(arg) {
   return new RegExp(/^\d+$/).exec(arg) ? true : false;
}

/** @param {number} arg  Floating point value passed? */
export function is_float(arg) {
   return new RegExp(/^\d+\.\d+$/).exec(arg) ? true : false;
}

/** @param {NS} ns The Netscript API */
export const has_option = (ns, opt) => {
   return ns.args.includes(opt) ? true : false;
}

/** @param {NS} ns The Netscript API */
export const get_option = (ns, opt) => {

   'use strict';

   for (let i = 0; i < ns.args.length - 1; i++)
      if (ns.args[i] == opt) return ns.args[i + 1];
}

/** @param {NS} ns The Netscript API */
export const get_list = (ns, opt) => {

   'use strict';

   let opts = [];

   for (let i = 0; i < ns.args.length; i++)
   {
      if (ns.args[i] == opt)
      {
         for (let k = i + 1; k < ns.args.length; k++)
         {
            if (ns.args[k].match(/^-+\w*$/i)) return opts;
            opts.push(ns.args[k]);
         }
      }
   }
   return opts;
}


/** @param {NS} ns The Netscript API */
export const parse_ini = (ns) => {

   'use strict';

   let lines = [], options = {}, inifile = get_option(ns, '-i');

   if (!ns.fileExists(inifile)) return null;
   else
   {
      let str = ns.read(inifile);

      let k = 0;
      for (let i = 0; i < str.length; i++) {

         let char = str.charAt(i);

         if (char == "\n") { // Whoops, we found a line feed.

            k++;

            continue;
         }
         lines[k] = sprintf(`${(lines[k]) ? lines[k] : ''}${char}`);
      }

      lines.forEach(l => {

         let regex = /^#.*$/;

         if (! regex.test(l))
         {
            regex = /^(.*)=(.*)$/i;
            regex.test(l);

            //let   key = RegExp.$1;
            //let value = RegExp.$2;

            //options[key] = value;

            options[RegExp.$1] = RegExp.$2;
         }
      });
   }

   return options;
}


/**
 ** For older versions 
 *  TODO: Correct parameter description !!! 
 * @param(bool):  arg   number   One element of the args[*] array.
 * @param(num):   arg   number   One element of the args[*] array.
 * @param(str):   arg   number   One element of the args[*] array.
 * @param(int):   arg   number   One element of the args[*] array.
 * @param(flt):   arg   number   One element of the args[*] array.
 */
export var a = {

   count: (args, c) => {
      return args.length === c ? true : false;
   },

   //isRegEx: (arg) => { return arg.match(#/.*/#) ? true : false; },

   bool:    (arg) => { return typeof arg === 'boolean'           ? true : false },
   num:     (arg) => { return typeof arg === 'number'            ? true : false },
   str:     (arg) => { return typeof arg === 'string'            ? true : false },
   int:     (arg) => { return new RegExp(/^\d+$/).exec(arg)      ? true : false },
   flt:     (arg) => { return new RegExp(/^\d+\.\d+$/).exec(arg) ? true : false },
   isRegEx: (arg) => { return new RegExp(/\/.*\//).exec(arg)     ? true : false }
}
