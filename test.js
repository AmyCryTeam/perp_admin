const Big = require('big.js')

const marketPrice = new Big(1452.72);
const entryPrice = new Big(1352.72);

const diff = marketPrice.minus(entryPrice).div(entryPrice).abs();

console.log(diff.toString(), diff.gte(0.02))
