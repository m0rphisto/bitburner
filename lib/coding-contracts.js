/**
 * $Id: coding-contracts.js v0.1 2023-09-06 09:02:31 1.80GB .m0rph $
 * 
 * Description:
 *  Function library for the coding contract routines.
 */
export async function main(ns) {
    ns.tprintf(`Sorry, this is only a library. No direct usage!`);
}

/**
 * The coding contract types and their corresponding worker scripts.
 */
export const ctypes = {
    // Not yet implemented.
    //'Find Largest Prime Factor': '/coding-contracts/largest-primefactor.js',
    //'Subarray with Maximum Sum': '/coding-contracts/subarray-maxsum.js',
    //####################################################################
    'Total Ways to Sum': '/coding-contracts/total-ways-to-sum.js',
    //####################################################################
    //'Total Ways to Sum II': '/coding-contracts/total-ways-to-sum.2.js',
    //'Spiralize Matrix': '/coding-contracts/spiralize-matrix.js',
    //'Array Jumping Game': '/coding-contracts/array-jumping.js',
    //'Array Jumping Game II': '/coding-contracts/array-jumping.2.js',
    //'Merge Overlapping Intervals': '/coding-contracts/merge-intervals.js',
    //'Generate IP Addresses': '/coding-contracts/genip.js',
    //'Algorithmic Stock Trader I': '/coding-contracts/stock-trader.js',
    //'Algorithmic Stock Trader II': '/coding-contracts/stock-trader.2.js',
    //'Algorithmic Stock Trader III': '/coding-contracts/stock-trader.3.js',
    //'Algorithmic Stock Trader IV': '/coding-contracts/stock-trader.4.js',
    //'Minimum Path Sum in a Triangle': '/coding-contracts/triangle-minpathsum.js',
    'Unique Paths in a Grid I': '/coding-contracts/unique-paths.js',
    //'Unique Paths in a Grid II': '/coding-contracts/unique-paths..2js',
    //'Shortest Path in a Grid': '/coding-contracts/shortest-path.js',
    //'Sanitize Parentheses in Expression': '/coding-contracts/parantheses.js',
    //'Find All Valid Math Expressions': '/coding-contracts/valid-math.js',
    //'HammingCodes: Integer to Encoded Binary': '/coding-contracts/hc.integer-to-binary.js',
    //'HammingCodes: Encoded Binary to Integer': '/coding-contracts/hc.binary-to-integer.js',
    //'Proper 2-Coloring of a Graph': '/coding-contracts/two-coloring-graph.js',
    //'Compression I: RLE Compression': '/coding-contracts/compression-1.js',
    //'Compression II: LZ Decompression': '/coding-contracts/compression-2.js',
    //'Compression III: LZ Compression': '/coding-contracts/compression-3.js',
    //'Encryption I: Caesar Cipher': '/coding-contracts/encryption-1.js',
    //'Encryption II: Vigenère Cipher': '/coding-contracts/encryption-2.js'
}

/**
 * Get the complete network except purchased servers and home.
 * 
 * @param {NS} ns The Netscript API.
 * @returns {string} net[]  The server's network.
 */
export const get_network = (ns) => {
    let net = new Set(['home']);
    net.forEach(a => ns.scan(a).forEach(b => b.match('pserv') ?? net.add(b).delete('home')));
    //return ['home']; // Only for development purposes.
    return net;
}