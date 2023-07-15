
/** 
 * filename: arguments.js
 * date: 2023-07-08
 * version: 0.1
 * author: .m0rph
 * 
 * descripttion:
 *    Module for argument handling on ns.args[*].
 * 
 * @param(count): args  array    The args[*] array.
 *                c     number   The argument count.
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

   num:     (arg) => { return typeof arg === 'number'            ? true : false },
   str:     (arg) => { return typeof arg === 'string'            ? true : false },
   int:     (arg) => { return new RegExp(/^\d+$/).exec(arg)      ? true : false },
   flt:     (arg) => { return new RegExp(/^\d+\.\d+$/).exec(arg) ? true : false },
   isRegEx: (arg) => { return new RegExp(/\/.*\//).exec(arg)     ? true : false }
}
