 /**
  * $Id: fibonacci.js v0.1 2023-09-08 23:05:34 3.00GB .m0rph $
  * 
  * Description:
  *   This educational script calculats Fibonacci numbers.
  * 
  *   Formula: fn = fn-1 + fn-2  (while n >= 3)
  * 
  * @param {NS} ns The Netscripts API.
  */ 
import { c } from '/modules/colors.js';
import { has_count, is_integer } from '/modules/arguments.js';
import { exit, header, div, footer } from '/modules/helpers.js';
export async function main(ns) {

   let fibonacci = [];

   const max = has_count(ns.args, 1)
      ? is_integer(ns.args[0])
         ? ns.args[0]
         : exit(ns, 'Integer expected.')
      : 100;

   header(ns, 'ns', 'Fibonacci numbers');

   const for_loop_fib = (max) => {
      // Bottom up variant. (my own)
      for (let i = 0; i < max + 1; i++) {
         if (i < 2) {
            fibonacci[i] = i;
         }
         else {
            fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
         }
      }
      return fibonacci.pop();
   }
   /**
    * rec_fib() deactivated due to infinite loop condition.
    * This recursion has TOO MUCH recursive calls for
    * the same operation.
    *
   const rec_fib = (n) => {
      if (n <= 1) return n;
      return rec_fib(n -1) + rec_fib(n - 2);
   }
    */
   const NIL = -1;
   let lookup = new Array(max + 1);
   for (let i = 0; i < max + 1; i++) lookup[i] = NIL;
   const memoization_rec_fib = (n) => {
      // Top down variant. (https://www.geeksforgeeks.org/overlapping-subproblems-property-in-dynamic-programming-dp-1/)
      if (lookup[n] == NIL) {
         if (n <= 1)
            lookup[n] = n;
         else
            lookup[n] = memoization_rec_fib(n - 1) + memoization_rec_fib(n - 2);
      }
      return lookup[n];
   }
   const tabulation_rec_fib = (n) => {
      return `Fibonacci number of ${n} Coming soon.`;
   }
   ns.tprintf(`${c.white}for_loop_fib(), a simple function with a for loop:\n${for_loop_fib(max)}`);
   div(ns);
   ns.tprintf(`${c.white}stat_rec_fib(), a static recursive function:\n${c.red}Deactivated because Bitburner runs into infinite loop state.`);
   div(ns);
   ns.tprintf(`${c.white}memoization_rec_fib(), a simple function with a for loop:\n${memoization_rec_fib(max)}`);

   footer(ns);
}