/**
 * $Id: unique-paths.js v0.3 2023-09-06 16:20:08 18.00GB .m0rph $
 * 
 * description:
 *  Coding contract: Unique Paths in a Grid I.
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
   has_count(ns.args, 0) && exit(ns, 'unique-paths: Run this script via run-contracts.js.')
   const
      cc = JSON.parse(ns.args[0]),
      cdata = ns.codingcontract.getData(cc.file, cc.host),
      get_paths = (rows, cols) => {
         let i, k, grid = [[]];
         // Adding the first row of 1's to the array.
         for (k = 0; k < cols; k++)
            grid[0].push(1);
         // Iterate over each row.
         for (i = 1; i < rows; i++) {
            grid.push([1]); // Adding 1 to the first, left most square.
            // Get the total for the current square.
            for (k = 1; k < cols; k++)
               grid[i][k] = grid[i][k - 1] + grid[i - 1][k];
         }
         // Return the bottom right hand value that has the total.
         return grid[i - 1][k - 1];
      };
      
   let result = await ns.codingcontract.attempt(get_paths(cdata[0], cdata[1]), cc.file, cc.host);
   ns.tprintf(`${c.white}Result: ${c.green}${result}`);
}