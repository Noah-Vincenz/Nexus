/**
 * @author Noah-Vincenz Noeh <noah-vincenz.noeh18@imperial.ac.uk>
 */

/* jshint esversion: 6 */

/*
* @author Vitim.us https://gist.github.com/victornpb/7736865
* @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
*/
export function occurrences(string, subString, allowOverlapping) {

   string += "";
   subString += "";
   if (subString.length <= 0) return (string.length + 1);

   var n = 0,
       pos = 0,
       step = allowOverlapping ? 1 : subString.length;

   while (true) {
       pos = string.indexOf(subString, pos);
       if (pos >= 0) {
           ++n;
           pos += step;
       } else break;
   }
   return n;
}

/**
 * Checks whether a given string is a number.
 * @param {string} num - The string to be checked.
 * @returns {boolean} The boolean value specifying whether the given string is a number.
 */
export function isNumeric(num){
    return !isNaN(num);
}

