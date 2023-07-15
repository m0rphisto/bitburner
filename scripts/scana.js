
function shell(cmd) {
    // Template code from the official documentation of Bitburner:
    // https://bitburner.readthedocs.io/en/latest/netscript/advancedfunctions/inject_html.html
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

   // And now we try to get the commands output back.
   //return globalThis['document'].getElementById('generic-react-container').querySelector('ul');
   //return globalThis['document'].getElementById('generic-react-container');
}

/** @param {NS} ns */
export async function main(ns) {

   const date = new Date();
   const timestamp = sprintf( // Formatted sringPrint: $s = string, %d = digit, %02d = digit with trailing null.
      '%d%02d%02d-%d%d%d',
      date.getFullYear(),  // 4 digits
      date.getMonth() + 1, // from 0 to 11 (so plus one)
      date.getDate(),      // getDay() gives us day of week, getDate() gives day of month
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
   );

   // NO !!! ERROR => usage is: new Date("january 1, 2000 08:00").toLocalTimeString()
   //                   or    : new Date().toLocalTimeString()
   //let ts = new Date().toLocalString();
   //ns.tprintf(`ts: ${ts}`);


   //ns.tprintf(`date: ${+date}`); // print the number of milliseconds, same as date.getTime()
   ns.tprintf(`timestamp: ${timestamp}`);

   let data = shell('scan-analyze 10');
   await ns.sleep(10000);
   //ns.write('/scripts/scana-1.js', data, 'w') ;

   //const term = globalThis['document'].getElementById('generic-react-container').querySelector('ul');
   const term = document.getElementById('terminal').querySelector('ul');
   //term.insertAdjacentHTML('beforeend', `<li><p color=lime>AHA, geht ja doc!</p></li>`);
   term.insertAdjacentHTML('beforeend', `<li><p color=lime>AHA, geht ja doc!</p></li>`);

   ns.tprintf('typeof term: %s', typeof term) ;
   //ns.write(`/scripts/scana-${timestamp}.js`, data, 'w') ;
}