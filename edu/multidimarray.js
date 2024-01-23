 /**
  * $Id: multidimarray.js v0.1 2023-09-09 10:22:37 1.60GB .m0rph $
  * 
  * Description:
  *   This educational script has an object with multidimensional arrays.
  * 
  *   I want to know, if I can create an array that has rows with
  *   different lengths.
  * 
  * 
  * @param {NS} ns The Netscripts API.
  */ 
import { c } from '/modules/colors.js';
import { header, div, footer } from '/modules/helpers.js';
export async function main(ns) {

   const arr = {
      '1': [
         ['a', 'b', 'c', 'd', 'e'],
         ['a', 'b', 'c', 'd']
      ],
      '2': [
         ['a', 'b', 'c', 'd'],
         ['a', 'b', 'c', 'd', 'e']
      ],
      '3': [
         ['n00dles', 'foodnstuff', 'joesguns', 'zero'],
         ['hong-fang-tea', 'harakiri-sushi', 'iron-gym']
      ]
   };

   const print_array = (num) => {
      if (arr[num] !== undefined) {
         // OK, we have to catch up these undefined array cells !!!
         for (let x = 0; x < arr[num].length; x++) {
            if (arr[num][x] !== undefined) {
               // ... also here ...
               for (let y = 0; y < arr[num][x].length; y++) {
                  // ... and here ...
                  if (arr[num][x][y] !== undefined)
                     ns.tprintf(`${c.white}Array[${num}][${x}][${y}]: ${arr[num][x][y]}`);
               }
            }
         }
      }
   }

   header(ns, 'ns', 'Multidimensional arrays');

   ns.tprintf(`${c.white}${print_array(1)}`);
   div(ns);
   ns.tprintf(`${c.white}${print_array(2)}`);
   div(ns);
   ns.tprintf(`${c.white}${print_array(3)}`);
   div(ns);
   ns.tprintf(`${c.white}${print_array(4)} (non existent one)`);

   footer(ns);

   /**
    * Resumee:
    * 
    * So, what have we learned?
    * 
    *    It is OK ok to have multidimensional arrays, respectively matrices with
    *    different lengths in rows, but we have to catch upcoming errors!
    * 
    *    For example:
    *       The Array.method().length cannot read indices from
    *       non existent elements and throws an error. 
    */
}
