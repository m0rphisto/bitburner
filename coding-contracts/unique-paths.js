/**
 * $Id: unique-paths.js v0.1 2023-09-05 21:14:27 1.60GB .m0rph $
 * 
 * description:
 *  Coding contract: Unique paths in a grid.
 * 
 * 
 * @param {NS} ns 
 */ 
import { c } from '/modules/colors.js';
import { has_count, is_integer } from '/modules/arguments.js';
import { exit, header, footer } from '/modules/helpers.js';
export async function main(ns) {
    has_count(ns.args, 2) || exit(ns, 'We need two numbers.');
    const rows = is_integer(ns.args[0]) ? ns.args[0] : 3;
    const cols = is_integer(ns.args[1]) ? ns.args[1] : 3;
    const get_paths = (rows, cols) => {
        let i, k, grid = [[]];
        // Adding the first row of 1's to the array.
        for (k = 0; k < cols; k++) {
            grid[0].push(1);
        }
        // Iterate over each row.
        for (i = 1; i < rows; i++) {
            grid.push([1]); // Adding 1 to the first, left most square.
            // Get the total for the current square.
            for (k = 1; k < cols; k++) {
                grid[i][k] = grid[i][k - 1] + grid[i - 1][k];
            }
        }
        // Return the bottom right hand value that has the total.
        return grid[i - 1][k - 1];
    }
    header(ns, 'ns', 'Coding contracts - Unique paths in a grid')
    ns.tprintf(`${c.cyan}We have ${get_paths(rows, cols)} unique paths in a grid with ${rows} rows and ${cols} cols.`)
    footer(ns);
}