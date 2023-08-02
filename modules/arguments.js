/** 
 * $Id: arguments.js v0.2 2023-08-02 17:41:47 CEST 2.90GB .m0rph $
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
   return (((c) ? parseInt(c) : 0) && args.length > 0 && args.length == c) ? true : false;
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
      return (((c) ? parseInt(c) : 0) && args.length > 0 && args.length == c) ? true : false;
   },

   //isRegEx: (arg) => { return arg.match(#/.*/#) ? true : false; },

   bool:    (arg) => { return typeof arg === 'boolean'           ? true : false },
   num:     (arg) => { return typeof arg === 'number'            ? true : false },
   str:     (arg) => { return typeof arg === 'string'            ? true : false },
   int:     (arg) => { return new RegExp(/^\d+$/).exec(arg)      ? true : false },
   flt:     (arg) => { return new RegExp(/^\d+\.\d+$/).exec(arg) ? true : false },
   isRegEx: (arg) => { return new RegExp(/\/.*\//).exec(arg)     ? true : false }
}

