/**
 * $Id: test.try-catch-eval.js v0.2 2023-08-05 02:09:10 CEST 6.45GB .m0rph $
 * 
 * @param {NS} ns
 */
export async function main(ns) {
/*
   Here we have to compare
   
      variable = `get${MethodName}`;
      try { ns[variable]() } catch (e) { ... }
      
   respectively 
   
      variable = 'dynamic created source code';
      try { eval(variable) } catch (e) { ... }
      
   source code against the regular Netscript API calls.
   
   As sofware developers we always have to keep in mind, that every single character of our scripted
   source code has to be loaded into physical memory, wether we're coding in interpreted script languages
   or hard compiled, so called high languages such as C, C++, Rust or what ever. That doesn't matter.

   On a 64Bit system one ASCII character is not only ONE BYTE, respectively two bytes for UTF-8!
   
      ASCII :: 64 /  8 = 8 
      UTF-8 :: 64 / 16 = 4
      ====================
   
   So one single character such as a, b or á really consumes 8 Bytes on the physical RAM page, because
   a so called byte word is 64 Bit long --> Also a CPU register, it is at a size of 64 bit!
   
    8 Bit --> 1 Byte :: 01101110 == n (ASCII)
   16 Bit --> 2 Byte :: 0000006e == n (UTF-8) --> 0000000001101110
   32 Bit --> 4 Byte :: 0000006e == n (UTF-8) --> 00000000000000000000000001101110
   64 Bit --> 8 Byte :: 0000006e == n (UTF-8) --> 0000000000000000000000000000000000000000000000000000000001101110

   OK, a hex editor shows you indeed only two bytes per character, but this is not the same
   what really on the hardware happens.

   An example for the massive waste:
   f --> 0000000000000000000000000000000000000000000000000000000001100110 --> \x66
   o --> 0000000000000000000000000000000000000000000000000000000001101111 --> \x6f
   r --> 0000000000000000000000000000000000000000000000000000000001110010 --> \x72
   E --> 0000000000000000000000000000000000000000000000000000000001000101 --> \x45
   a --> 0000000000000000000000000000000000000000000000000000000001100001 --> \x61
   c --> 0000000000000000000000000000000000000000000000000000000001100011 --> \x63
   h --> 0000000000000000000000000000000000000000000000000000000001101000 --> \x68
     --> 0000000000000000000000000000000000000000000000000000000000100000 --> \x20
   ( --> 0000000000000000000000000000000000000000000000000000000000101000 --> \x28
   ...
   ...

   https://en.wikipedia.org/wiki/64-bit_computing


   Computing: long integers or floating points ? Really heaven, cause way more precise !!! 
   Human readable characters: MASSIVE WASTE OF RESOURCES and RAM page blowing up !!!
   
   So, do we really want to waste our RAM with NULLs?

   OK, one might say: I don't care about a few bytes. I have 32GB of RAM in my computer. But it's
   getting even worse, because such a behavior results in cummulative wasted resources. Anyways, one
   major thing should be clear: Less characters to parse by the interpreter and on the fly compilation
   into machine readable binary code, definitely means FASTER code!


   Only due to that reason the developers of programming languages brought in the so called chaining.

      object.method().method().......

   Not for making our coder's life easier. No, for saving CHARACTERS!

   And only for that reason we use webpack! Coding in ECMAScript, respectively TypeScript and then
   the source goes through the code packer. A

      function getSomeJobToBeDone(foo, bar, baz) { ... }

   results in: 
   
      19651:(e,t,n)=>{"use strict";n.d(t,{S:()=>1});........}


   OK, so lets take a look:
*/
   let servers = new Set(['home']);
   servers.forEach(a => ns.scan(a).forEach(b => b.match('pserv') ?? b.add(a).delete('home')));
   servers.forEach(target => {

      ns.deleteServer; // Just a little 2.25GB static RAM feed3r due to the try-catch 5x ns[port_opener]() ... 
                       // Otherwise we have a static/dynamic RAM allocation error.

      const port_opener = ['BruteSSH', 'FTPCrack', 'HTTPWorm', 'relaySMTP', 'SQLInject'];
      const open_port   = (port) => {

         if (ns.fileExists(`${port}.exe`)) {

            try {
               ns[port.toLowerCase()](target);
            }
            catch (e) {
               ns.tprintf(`${c.red}ERROR: ${e}${reset}`);
            }
         }
      };
      port_opener.forEach(open_port);
   });
/*
   554 characters (without comments, whitespaces \x20 and linefeeds \x0d)

   AGAINST:
*/

   let host, scanned;
   const getServerList = (hostname) => {
      let host = (hostname) ? hostname : ns.getHostname();
      if (! scanned.includes(host)) scanned.push(host);
      return ns.scan(host);
   }

   let hosts = getServerList();
   while (host = hosts.shift()) {
      if (scanned.includes(host))  continue;
      let h = ns.getServer(host);
      if (! h.purchasedByPlayer) {
         hosts = hosts.concat(getServerList(h.hostname));
      }
   }

   for (let target of scanned) {
      if (ns.fileExists('BruteSSH.exe'))  ns.brutessh(target);
      if (ns.fileExists('FTPCrack.exe'))  ns.ftpcrack(target);
      if (ns.fileExists('HTTPWorm.exe'))  ns.httpworm(target);
      if (ns.fileExists('relaySMTP.exe')) ns.relaysmtp(target);
      if (ns.fileExists('SQLInject.exe')) ns.sqlinject(target);
    }
/*
   781 characters  (without whitespaces \x20 and linefeeds \x0d)


   That makes a difference of 227 characters, what in fact are 14,528
   wasted bits. Just for fun: compute yourself: main.bundle.js has
   a size of 2,461,975 Bytes, and this is webpacked code. ;-)



   AND HERE WE ONLY HAVE VERY LITTLE 24 LINES OF CODE !!!
   WHAT ABOUT HUNDREDs OR THOUSANDs OF SOURCE CODE LINES ???

   In my opinion we HAVE to care about, and so SURE I will use
   dynamic created API calls. OK, I have to keep in mind the static
   and dynamic allocated RAM amounts, but a

      ns.deleteServer;

   16  [ x 64 = 1024 bits ] characters wasted API call compared against
   227 [ x 64 = 14,528 bits ] waste, only not to get in trouble, THAT is
   a thing I do care about.

   ######################################################################

   BUT, BUT, BUT !!!

   For security reasons NEVER use a try { eval() } catch() { ... }.
                                          ^^^^^^

   For sure, it is a very handy, fast coded but massivley insecure way,
   because we always have to keep Cross Site Scripting in mind,
   where an attacker tries to inject his JavaScript code into the
   site displayed in the other tabs, other frames or whaterver.

   We better should create object and can then call the methods via
   variables, as shown in the example above. ;-)

      --> ns[port.toLowerCase()](target);

   So long...

   .m0rph
*/
}

