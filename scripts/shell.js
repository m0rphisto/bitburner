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

/** 
 * HTML injection in the Bitburner terminal.  A workaround for
 * using a script to enter commands at the terminal.
 * 
 * @param {NS} ns 
 */
export async function main(ns) {
    
   if (ns.args.length > 0) {

      let cmd;

      ns.tprintf('ns.args.length: %s', ns.args.length);
      ns.tprintf('ns.args.[0]: %s', ns.args[0]);
      //ns.exit();

      cmd = ns.args[0];
      ns.tprintf('cmd: %s', cmd);
      // Assume you start from home server.
      //const cmd = "connect n00dles; run NUKE.exe; backdoor; home";
      // OR "connect n00dles; analyze; home";
      shell(cmd);

      // NOPE :: Wrong documentation !!! ;-) 
      //const output = globalThis["document"].getElementById("terminal").querySelector('ul');
      const output = globalThis["document"].getElementById("terminal");
      //console.clear();
      //console.log('output: '+output);
      for (let i = 0; i < output.childNodes.length; i++) {
         /** 
          *  OK, the debugger shows:
          *    <ul id='terminal' ...>
          *        <li class='lkjhlkjhlkjh'>
          *             <div class='lkjhlkjh'>
          *                 <[span|p]>
          *                     text, foo bar baz.
          *                     <a href='link to server>servername</a>
          *                 </[span|p]>
          *             </div>
          *        </li>
          *    </ul>
          */
         //ns.tprintf('WARN :: %s', output.childNodes[i].querySelector('li').innerHTML);
         ns.tprintf('WARN :: %s', output.childNodes[i].querySelector('li').innerHTML);
      }

   } else {
      ns.tprint("ERROR :: No cmd passed. Exiting !!!");
   }
}