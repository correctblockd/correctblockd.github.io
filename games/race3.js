let prices = [6, 4, 9];
let quantities = [2, 3, 1];
let total = 0;
// it used to be i <= but the = did a 0
for (let i = 0; i < prices.length; i++) {
  let lineTotal = prices[i] * quantities[i];
  if (quantities[i] >= 3) {
    lineTotal -= quantities[i];
  }
  total += lineTotal;
}

console.log("Total:", total);