/** 
 * $Id: next.js v0.3 2023-08-28 09:04:22 2.25GB .m0rph $
 * 
 * description:
 *    What will be our next target?
 * 
 *    We need a server's required hacking level half of our own or lower,
 *    we need a highest possible server's max money and we need a
 *    security level as low as possible, so we calculate a weight
 *    over these facts for every single server on the network.
 * 
 *    In the end, the server with the highest weighting wins!
 * 
 * @param {NS} ns
 */

import {
   log,
   header,
   get_next
} from '/modules/helpers.js';
import {c} from '/modules/colors.js';
import {d} from '/modules/datetime.js';

export async function main(ns) {

   'use strict';

   const target = get_next(ns);
   header(ns, 'ns', `${c.white}NEXT TARGET ${target}`);
   log(ns, `/log/next-target.${d.getdate()}.js`, target);
}
