/** 
 * $Id: firstsub.js v0.3 2023-08-15 12:28:37 CEST 4.80GB .m0rph $
 * 
 * description:
 *    After augmentation installation we have to start at the beginning,
 *    where we want to 0wn the null port boxes.
 * 
 *    -p [012] Ports to open
 *    -r       Threads for HGW. !!! Cannot use -t, because the system uses it for threads too !!!
 * 
 * Note:
 *    With every new starting BitNode the network toplogy changes !!!
 *    So we have to rewrite this script.
 * 
 * @param {NS} ns
 *             ns.args[0]  string   Hostname of target server
 */


import {c} from '/modules/colors.js';
import {get_option} from '/modules/arguments.js';

export async function main(ns) {

   'use strict';

   ns.tail();

   // Greetings new run ...
   const
      deploy  = '/looper/deploy.js',
      looper  = '/looper/master.js',
      weaken  = '/looper/weaken.js',
      grow    = '/looper/grow.js',
      hack    = '/looper/mhack.js',
      ports   = get_option(ns, '-p') ?? 0,
      threads = get_option(ns, '-r') ?? 1,
      hosts   = {
         0:[
            'n00dles',  'foodnstuff', 'sigma-cosmetics', 'joesguns', 'hong-fang-tea', 'nectar-net', 'harakiri-sushi'
         ],
         1: [
            'max-hardware', 'CSEC', 'zer0', 'neo-net', 'iron-gym'
         ],
         2: [
            'omega-net', 'the-hub', 'johnson-ortho', 'crush-fitness', 'avmnite-02h', 'silver-helix', 'phantasy'
         ],
         3: [
            'summit-uni', 'computek', 'catalyst', 'netlink', 'rothman-uni', 'I.I.I.I'
         ]
      },
      sleep_time = {
         0: 1000,
         1: 3000,
         2: 6000,
         3: 9000
      };

   //ns.tprintf(`ports: ${ports}, threads: ${threads}`)
   //ns.exit();

   //scanned.forEach(a => ns.scan(a).forEach(b => scanned.add(b).delete('home')));
   for (let i = 0; i < hosts[ports].length; i++)
   {
      let cmd, host = hosts[ports][i];
      
      if (!ns.hasRootAccess(host))
      {
         ns.printf(`Opening ports`)
         if (ns.fileExists('BruteSSH.exe'))  ns.brutessh(host);
         if (ns.fileExists('FTPCrack.exe'))  ns.ftpcrack(host);
         if (ns.fileExists('HTTPWorm.exe'))  ns.httpworm(host);
         if (ns.fileExists('relaySMTP.exe')) ns.relaysmtp(host);
         if (ns.fileExists('SQLInject.exe')) ns.sqlinject(host);

         ns.printf(`Executin nuke()`)
         ns.nuke(host);
      }

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
               if (host == 'nectar-net')    { cmd = 'sigma-cosmetics; connect nectar-net'; break }
            case 1:
               if (host == 'zer0')          { cmd = 'n00dles; connect zer0'; break }
               if (host == 'neo-net')       { cmd = 'n00dles; connect zer0; connect neo-net'; break }
               if (host == 'max-hardware')  { cmd = 'hong-fang-tea; connect max-hardware'; break }
               if (host == 'CSEC')          { cmd = 'hong-fang-tea; connect CSEC'; break }
            case 2:
               if (host == 'silver-helix')  { cmd = 'n00dles; connect zer0; connect silver-helix'; break }
               if (host == 'johnson-ortho') { cmd = 'n00dles; connect zer0; connect silver-helix; connect johnson-ortho'; break }
               if (host == 'the-hub')       { cmd = 'n00dles; connect zer0; connect neo-net; connect the-hub'; break }
               if (host == 'phantasy')      { cmd = 'sigma-cosmetics; connect nectar-net; connect phantasy'; break }
               if (host == 'crush-fitness') { cmd = 'sigma-cosmetics; connect nectar-net; connect phantasy; connect crush-fitness'; break }
               if (host == 'omega-net')     { cmd = 'sigma-cosmetics; connect nectar-net; connect omega-net'; break }
               if (host == 'avmnite-02h')   { cmd = 'sigma-cosmetics; connect nectar-net; connect omega-net; connect avmnite-02h'; break }
            case 3:
               if (host == 'netlink')       { cmd = 'n00dles; connect zer0; connect silver-helix; connect netlink'; break }
               if (host == 'catalyst')      { cmd = 'n00dles; connect zer0; connect neo-net; connect the-hub; connect catalyst'; break }
               if (host == 'summit-uni')    { cmd = 'sigma-cosmetics; connect nectar-net; connect omega-net; connect avmnite-02h; connect summit-uni'; break }
               if (host == 'computek')      { cmd = 'sigma-cosmetics; connect nectar-net; connect phantasy; connect computek'; break }
               if (host == 'rothman-uni')   { cmd = 'sigma-cosmetics; connect nectar-net; connect phantasy; connect computek; connect rothman-uni'; break }
               if (host == 'I.I.I.I')       { cmd = 'sigma-cosmetics; connect nectar-net; connect phantasy; connect crush-fitness; connect I.I.I.I'; break }
         }

         if (cmd)
         {
            let ccmd = `home; connect ${cmd}; backdoor`;
            ns.printf(`Executing ${ccmd}`)
            shell(ccmd);
            await ns.sleep(sleep_time[ports]);

            ns.tprintf(`${c.magenta}And finaly installed the backdoor on ${host}.${c.reset}`);
         }
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
