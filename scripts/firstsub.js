/** 
 * $Id: firstsub.js v0.2 2023-08-14 21:27:30 CEST 4.80GB .m0rph $
 * 
 * description:
 *    After augmentation installation we have to start at the beginning,
 *    where we want to 0wn the null port boxes.
 * 
 *    -p [012] Ports to open
 *    -r       Threads for HGW. !!! Cannot use -t, because the system uses it for threads too !!!
 * 
 * @param {NS} ns
 *             ns.args[0]  string   Hostname of target server
 */


import {c} from '/modules/colors.js';
import {has_option, get_option} from '/modules/arguments.js';

export async function main(ns) {

   'use strict';

   // Greetings new run ...
   const
      deploy  = '/looper/deploy.js',
      looper  = '/looper/master.js',
      weaken  = '/looper/weaken.js',
      grow    = '/looper/grow.js',
      hack    = '/looper/mhack.js',
      ports   = has_option(ns, '-p') ? get_option(ns, '-p') : 0,
      threads = has_option(ns, '-r') ? get_option(ns, '-r') : 1,
      hosts   = {
         0:[
            'n00dles',  'foodnstuff', 'sigma-cosmetics', 'joesguns',
            'hong-fang-tea', 'harakiri-sushi', 'nectar-net',
         ],
         1: [
            'iron-gym', 'max-hardware', 'CSEC',
            'zer0', 'neo-net',
         ],
         2: [
            'silver-helix', 'phantasy', 'omega-net', 'avmnite-02h',
            'johnson-ortho', 'the-hub', 'crush-fitness',
         ]
      };

   //scanned.forEach(a => ns.scan(a).forEach(b => scanned.add(b).delete('home')));
   for (let i = 0; i < hosts[ports].length; i++)
   {
      let host = hosts[ports][i];
      
      if (ns.fileExists('BruteSSH.exe'))  ns.brutessh(host);
      if (ns.fileExists('FTPCrack.exe'))  ns.ftpcrack(host);
      if (ns.fileExists('HTTPWorm.exe'))  ns.httpworm(host);
      if (ns.fileExists('relaySMTP.exe')) ns.relaysmtp(host);
      if (ns.fileExists('SQLInject.exe')) ns.sqlinject(host);

      ns.nuke(host);
      if (ns.hasRootAccess(host))
      {
         // Any further actions only make sense, if we 0wned the box.
         ns.tprintf(`${c.magenta}Did nuke() ${host}.${c.reset}`);
   
         if (ns.getServerMaxRam(host) > 0)
         {
            ns.run(deploy, 1, host);
            ns.run(looper, 1, host);

            ns.tprintf(`${c.magenta}Did deploy ${host} and started the looper master.${c.reset}`);
         }
         else
         {
            ns.run(weaken, threads, host); await ns.sleep(1000);
            ns.run(grow,   threads, host); await ns.sleep(1000);
            ns.run(hack,   threads, host); await ns.sleep(1000);

            ns.tprintf(`${c.magenta}Did locally start weaken(), grow() and mhack() for ${host}.${c.reset}`);
         }

         switch (ports)
         {
            // Only hosts in home's subnet are directly connectable.

            case 0:
               host = `${host == 'nectar-net'    ? 'sigma-cosmetics; connect nectar-net'   : host}`;
               break;
            case 1:
               host = `${host == 'max-hardware'  ? 'sigma-cosmetics; connect max-hardware' : host}`;
               host = `${host == 'zer0'          ? 'hong-fang-tea; connect zer0'           : host}`;
               host = `${host == 'CSEC'          ? 'iron-gym; connect CSEC'                : host}`;
               host = `${host == 'neo-net'       ? 'CSEC; connect neo-net'                 : host}`;
               break;
            case 2:
               host = `${host == 'silver-helix'  ? 'max-hardware; connect silver-helix'    : host}`;
               host = `${host == 'phantasy'      ? 'phantasy; connect neo-net'             : host}`;
               host = `${host == 'omega-net'     ? 'nectar-net; connect omega-net'         : host}`;
               host = `${host == 'avmnite-02h'   ? 'omega-net; connect avmnite-02h'        : host}`;
               host = `${host == 'johnson-ortho' ? 'neo-net; connect johnson-ortho'        : host}`;
               host = `${host == 'the-hub'       ? 'silver-helix; connect the-hub'         : host}`;
               host = `${host == 'crush-fitness' ? 'neo-net; connect crush-fitness'        : host}`;
               break;
         }

         shell(`home; connect ${host}; backdoor`);
         await ns.sleep(6000);

         ns.tprintf(`${c.magenta}And finaly installed the backdoor on ${host}.${c.reset}`);
      }
      else
         ns.tprintf(`${c.magenta}Not able to nuke() ${host}. Check the darkweb !!!${c.reset}`);
   }
}

/**
 * A hackish way to implement shell scripting in Bitburner.  
 * Emulate terminal input.
 *
 * @param {string} cmd Run this command from the terminal.
 */

function shell(cmd) {
    /**
     *  Template code from the official documentation of Bitburner:
     *  https://bitburner.readthedocs.io/en/latest/netscript/advancedfunctions/inject_html.html 
     */
    const input = globalThis["document"].getElementById("terminal-input");
    input.value = cmd;

    const handler = Object.keys(input)[1];

    input[handler].onChange({
        target: input,
    });
    input[handler].onKeyDown({
        key: "Enter",
        preventDefault: () => null,
    });
}
