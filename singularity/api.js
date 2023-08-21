/**
 * $Id api.js v0.1 2023-08-18 02:29:45 51.20GB .m0rph $
 * 
 * description:
 *    At first we want to chack the API.
 * 
 * @param {NS} ns
 */

import {c} from '/modules/colors.js';
export async function main(ns) {

   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`);
   ns.tprintf(`${c.cyan}> The Singularity API${c.reset}`);
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`);

   for (let i = 0; i < Object.keys(ns.singularity).length; i++)
   {
      let
         idx  = sprintf('%02d', i),
         key  = Object.keys(ns.singularity)[i];



      ns.tprintf(`${c.white}${idx}: ns.singularity.${key}()${c.reset}`)

   }
   
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`);
   ns.tprintf(`${c.cyan}> Some API testing ... ${c.reset}`);
   ns.tprintf(`${c.cyan}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${c.reset}`);

   let i = 0;
   try {
      ns.singularity.isFocused(); // 0.1 GB * 16/4/1
      ns.singularity.checkFactionInvitations().forEach(fi => ns.tprintf(`${c.white}%02d) fi: ${fi}`, i++)) // 3GB * 16/4/1 (depending on the source file)
   }
   catch (e) {
      ns.tprintf(`${c.magenta}No, we do not have Singularity API access. Sorry ...`)
      ns.tprintf(`${c.red}Catch(e): ${e}`)
   }
   try {
      ns.singularity.connect('sigma-cosmetics');
   }
   catch (e) {
      ns.tprintf(`${c.magenta}No, we cannot connect to sigma-cosmetics. Sorry ...`)
      ns.tprintf(`${c.red}Catch(e): ${e}`)
   }
   try {
      ns.singularity.installBackdoor();
   }
   catch (e) {
      ns.tprintf(`${c.magenta}No, we cannot install backdoor. Sorry ...`)
      ns.tprintf(`${c.red}Catch(e): ${e}`)
   }

}
