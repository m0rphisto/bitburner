/** 
 * $Id: firstsub.js v0.4 2023-09-01 09:06:41 CEST 4.80GB .m0rph $
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
         ns.tprintf(`${c.magenta}Did nuke() ${host}.`);
   
         if (ns.getServerMaxRam(host) > 0)
         {
            ns.run(deploy, 1, host);
            ns.run(looper, 1, host);

            ns.tprintf(`${c.magenta}Did deploy ${host} and started the looper master.`);
         }
         else
         {
            ns.run(weaken, threads, host); await ns.sleep(1000);
            ns.run(grow,   threads, host); await ns.sleep(1000);
            ns.run(hack,   threads, host); await ns.sleep(1000);

            ns.tprintf(`${c.magenta}Did locally start weaken(), grow() and mhack() for ${host}.`);
         }
         switch (ports)
         {
            // Only hosts in home's subnet are directly connectable.
            case 0:
               if (host == 'n00dles')         { cmd = 'n00dles'; break }
               if (host == 'foodnstuff')      { cmd = 'foodnstuff'; break }
               if (host == 'sigma-cosmetics') { cmd = 'sigma-cosmetics'; break }
               if (host == 'joesguns')        { cmd = 'joesguns'; break }
               if (host == 'hong-fang-tea')   { cmd = 'hong-fang-tea'; break }
               if (host == 'harakiri-sushi')  { cmd = 'harakiri-sushi'; break }
               if (host == 'nectar-net')      { cmd = 'n00dles; connect nectar-net'; break }
               break;
            case 1:
               if (host == 'max-hardware')    { cmd = 'joesguns; connect max-hardware'; break }
               if (host == 'zer0')            { cmd = 'joesguns; connect zer0'; break }
               if (host == 'CSEC')            { cmd = 'joesguns; connect CSEC'; break }
               if (host == 'neo-net')         { cmd = 'joesguns; connect CSEC; connect neo-net'; break }
               break;
            case 2:
               if (host == 'silver-helix')    { cmd = 'n00dles; connect CSEC; connect silver-helix'; break }
               if (host == 'johnson-ortho')   { cmd = 'n00dles; connect CSEC; connect silver-helix; connect johnson-ortho'; break }
               if (host == 'phantasy')        { cmd = 'n00dles; connect CSEC; connect phantasy'; break }
               if (host == 'the-hub')         { cmd = 'n00dles; connect CSEC; connect phantasy; connect the-hub'; break }
               if (host == 'crush-fitness')   { cmd = 'n00dles; connect CSEC; connect neo-net; connect crush-fitness'; break }
               if (host == 'avmnite-02h')     { cmd = 'n00dles; connect CSEC; connect neo-net; connect avmnite-02h'; break }
               if (host == 'omega-net')       { cmd = 'joesguns; connect zer0; connect omega-net'; break }
               break;
            case 3:
               if (host == 'netlink')         { cmd = 'n00dles; connect CSEC; connect neo-net; connect netlink'; break }
               if (host == 'I.I.I.I')         { cmd = 'n00dles; connect CSEC; connect neo-net; connect avmnite-02h; connect I.I.I.I'; break }
               if (host == 'catalyst')        { cmd = 'n00dles; connect CSEC; connect silver-helix; connect johnson-ortho; connect catalyst'; break }
               if (host == 'summit-uni')      { cmd = 'n00dles; connect CSEC; connect silver-helix; connect johnson-ortho; connect summit-uni'; break }
               if (host == 'computek')        { cmd = 'joesguns; connect zer0; connect omega-net; connect computek'; break }
               if (host == 'rothman-uni')     { cmd = 'joesguns; connect zer0; connect omega-net; connect computek; connect rothman-uni'; break }
         }

         if (cmd)
         {
            let ccmd = `home; connect ${cmd}; backdoor`;
            ns.printf(`Executing ${ccmd}`)
            shell(ccmd);
            await ns.sleep(sleep_time[ports]);

            ns.tprintf(`${c.magenta}And finaly installed the backdoor on ${host}.`);
         }
      }
      else
         ns.tprintf(`${c.magenta}Not able to nuke() ${host}. Check the darkweb !!!`);
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