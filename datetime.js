/** 
 * filename: datetime.js
 * date: 2023-07-14
 * version: 0.2
 * author: .m0rph
 * 
 * descripttion:
 *    Module for date and time handling.
 * 
 * @param   m  {string|number}   Do we want to get milliseconds?
 */

export var d = {

   now: () => { return new Date() },

   getdate: () => {
      let date = d.now();
      return sprintf('%d-%02d-%02d', date.getFullYear(), date.getMonth() + 1, date.getDate());

   },

   getunixtime: () => {
      let date = d.now();
      // Gets the milliseconds passed since 1970-01-01
      return sprintf('%s', date.getTime());
   },

   gettime: (m) => {
      let date = d.now();
      let ms = (m) ? sprintf('-%03d', date.getMilliseconds()) : '';
      return sprintf('%02d:%02d:%02d%s', date.getHours(), date.getMinutes(), date.getSeconds(), ms);
   },
   
   timestamp: () => {
      let date = d.now();
      return sprintf('%d%02d%02d-%02d%02d%02d',
         date.getFullYear(), date.getMonth() + 1, date.getDate(),
         date.getHours(), date.getMinutes(), date.getSeconds()
      );
   }
}
