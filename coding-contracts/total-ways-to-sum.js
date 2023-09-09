/**
 * $Id: totals-ways-to-sum.js v0.1 2023-09-09 14:21:02 18.00GB .m0rph $
 * 
 * description:
 *  Coding contract: Total Ways to Sum.
 * 
 * Note:
 *  Utilized by run-contracts.js
 * 
 * @param {NS} ns 
 */ 
import { c } from '/modules/colors.js';
import { has_count } from '/modules/arguments.js';
import { exit } from '/modules/helpers.js';
export async function main(ns) {
   has_count(ns.args, 0) && exit(ns, 'total-ways-to-sum: Run this script via run-contracts.js.')
   const
      cc = JSON.parse(ns.args[0]),
      cdata = ns.codingcontract.getData(cc.file, cc.host),
      get_ways = (sum) => {
         let ways = Array.from({length: sum + 1}, () => 0);
         // Adding the first element to the array.
         ways[0] = 1;
         // Iterate over the range 1 to ((sum - 1) + 1) => sum.
         for (let row = 1; row < sum; row++) {
            // Iterate over the range 1 to (sum + 1).
            for (let col = 1; col < sum + 1; col++)
               if (col >= row)
                  ways[col] = ways[col] + ways[col - row];
         }
         // Return the total number of ways to sum.
         return ways[sum];
      };
      
   let result = await ns.codingcontract.attempt(get_ways(cdata), cc.file, cc.host);
   ns.tprintf(`${c.white}Result: ${c.green}${result}`);
}
