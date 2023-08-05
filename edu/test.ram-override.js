/**
 * Id: test.ram-override.js v0.1 2023-08.05 20:55:09 2.90GB .m0rph $
 * 
 *  @param {NS} ns
 */
export async function main(ns) {
   // Base RAM cost: 1.60GB

   // with ns.exec: 2.90GB
   ns.exec('/looper/weaken.js', 'home', 1, 'phantasy');

/*
At first the static RAM allocation':
[home /edu/]> mem test.ram-override.js
This script requires 2.90GB of RAM to run for 1 thread(s)
  1.60GB | baseCost (misc)
  1.30GB | exec (fn)
[home /edu/]> mem /looper/weaken.js
This script requires 1.80GB of RAM to run for 1 thread(s)
  1.60GB | baseCost (misc)
  0.15GB | weaken (fn)
  0.05GB | getHostname (fn)

And now the dynamic RAM allocation:
[home /edu/]> free
Total:     16.38TB
Used:       0.00GB (0.00%)
Available: 16.38TB
[home /edu/]> run test.ram-override.js
Running script with 1 thread(s), pid 82 and args: [].
[home /edu/]> tf
Script                                  PID       Threads         RAM Usage
looper/weaken.js                        83        1               1.80GB
Total:     16.38TB
Used:       1.80GB (0.01%)
Available: 16.38TB

Hmmmmmm........ wtf!
OK, now with ramOverride.
*/

   // with ns.exec: 2.90GB
   ns.exec('/looper/weaken.js', 'home', {ramOverride: 2}, 'phantasy');

/*
[home /edu/]> run test.ram-override.js
Running script with 1 thread(s), pid 84 and args: [].
[home /edu/]> tf
Script                                  PID       Threads         RAM Usage
looper/weaken.js                        83        1               1.80GB
looper/weaken.js                        85        1               1.80GB
looper/weaken.js                        86        1               2.00GB
Total:     16.38TB
Used:       5.60GB (0.03%)
Available: 16.38TB

OK, exactly what it should do !!!

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

Now we try the /looper/master.js like it's started from deploy. I think the
problem is the dynamic RAM allocation, when I exec() a script which itself
exec()'s another script, what would I call a chained-exec().

   +------------------------------------------------------+
   | deploy.js   +--------------------------------------+ |
   |   exec() => | master.js +------------------------+ | |
   |   8.05GB    | exec() => | {hack,grow,weaken}.js  | | |
   |             | 6.95GB    | (1.75|1.80|1.80)GB     | | |
   |             |           +------------------------+ | |
   |             +--------------------------------------+ |
   +------------------------------------------------------+

   I suspect, that I have to allocate the {hack,grow,weaken} RAM already
   at deploy's ns.exec('/looper/master.js', base, {ramOverride: 9}, args).

   static RAM...
      deploy.js: 8.05GB
      master.js: 6.95GB
   
   dynamic RAM...
      deploy.js: 8.05GB + 6.95GB + 1.80GB => 16.80GB
      master.js:          6.95GB + 1.80GB =>  8.75GB

*/

   ns.exec('/looper/master.js', 'pserv-0-0', {ramOverride: 9}, ...['phantasy', true]);
/*

[home /]> tf
Script                                  PID       Threads         RAM Usage
looper/weaken.js                        83        1               1.80GB
looper/weaken.js                        85        1               1.80GB
looper/weaken.js                        86        1               2.00GB
looper/weaken.js                        98        1               1.80GB
looper/weaken.js                        99        1               2.00GB
Total:     16.38TB
Used:       9.40GB (0.06%)
Available: 16.37TB
[home /]> run /edu/test.ram-override.js
Running script with 1 thread(s), pid 101 and args: [].
[home /]> tf
Script                                  PID       Threads         RAM Usage
looper/weaken.js                        83        1               1.80GB
looper/weaken.js                        85        1               1.80GB
looper/weaken.js                        86        1               2.00GB
looper/weaken.js                        98        1               1.80GB
looper/weaken.js                        99        1               2.00GB
looper/weaken.js                        102       1               1.80GB
looper/weaken.js                        103       1               2.00GB
Total:     16.38TB
Used:      13.20GB (0.08%)
Available: 16.37TB
[home /]> connect pserv-0-0
Connected to pserv-0-0
[pserv-0-0 /]> tf
Script                                  PID       Threads         RAM Usage
looper/master.js                        104       1               9.00GB
looper/weaken.js                        105       563             1.01TB
Total:     1.02TB
Used:      1.02TB (99.84%)
Available: 1.60GB
[pserv-0-0 /]> 

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

   !!! YEAH !!! 

   And that's it! No RAM usage error.
   
   No static/dynamic RAM allocation mismatch.

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/
}
