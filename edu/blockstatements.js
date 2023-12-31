/** @param {NS} ns */
export async function main(ns) {
   let x = 1;
   var y = 2;
   const z = 3;

   /**
    * Here a, for many people very confusing var/let/const problem comes up. ;-)
    * The var declaration is GLOBAL! So, with a var declaration within a block
    * or function (etc.) you can override variables!!!
    *
    * This is useful in some cases, indeed. For instance when I develop modules
    * and I do not have space for passing values, because I want to work with
    * (maybe) literal created objects or expensive classes, Or when I do not
    * want to confuse myself during development, because it makes the
    * debugging significantly harder.
    */

   ns.tprintf(`let x = 1: ${x}`);
   ns.tprintf(`var y = 2: ${y}`);
   ns.tprintf(`const z = 3: ${z}`);
   try {
      ns.tprintf(`a(undefined): ${a}`); // throws an error!
   } catch (e) {
      ns.tprintf(`${e}`);
   }

   if ( 1 == 1)
   {
      const a = 100;
      const z = 10;
      let x = 2; ns.tprintf(`if(1 == 1) let x = 2: ${x}`);
          y = 5; ns.tprintf(`if(1 == 1) y = 5: ${y}`);
                 ns.tprintf(`if(1 == 1) const z = 10: ${z}`);
                 ns.tprintf(`if(1 == 1) const a = 100: ${a}`);
   }

   ns.tprintf(`x after all: ${x}`) ;
   ns.tprintf(`y after all: ${y}`) ;
   ns.tprintf(`z after all: ${z}`) ;
   try {
      ns.tprintf(`a after all: ${a}`); // throws an error!
   } catch (e) {
      ns.tprintf(`${e}`);
   }

   {
      const anon_block = 'This is within a simple { ... } so called anonymous block.';
      ns.tprintf(anon_block); // throws an error!
   }
   try {
      ns.tprintf(`anon_block after all: ${anon_block}`); // throws an error!
   } catch (e) {
      ns.tprintf(`${e}`);
   }

   /**
    *  OK, throws an Error:
    *  --> Error while calculating ram usage for this script. Unexpected keyword 'const' (46:6)
    *  --> I see: ONLY Z-SHELL SCRIPTS CAN DO THIS !!!
   x < y && { 
      const true_block = 'This is within a simple { ... } so called anonymous block.';
      ns.tprintf(true_block); // throws an error!
   }
   try {
      ns.tprintf(`true_block after all: ${true_block}`); // throws an error!
   } catch (e) {
      ns.tprintf(`${e}`);
   }
   */
   const run_it = () => {
      ns.tprintf('OK, this works: expression && function_call(), or !expression || function_call().');
      return '\n'+
         'This is within a simple { ... } so called anonymous block.\n'+
         "OK, sorry! That doesn't work. We now use a lambda function.";
   }
   x < y && run_it();
   x > y || run_it();
   try {
      ns.tprintf(`true_block returned by run_it(): ${run_it()}`);
      ns.tprintf(`true_block after all: ${true_block}`); // throws an error!
   } catch (e) {
      ns.tprintf(`${e}`);
   }
}
