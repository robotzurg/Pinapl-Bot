const Enmap = require("enmap");

module.exports = {
  workList: new Enmap({ name: "workList" }),
  shop: new Enmap({ name: "shop" }),
  mmshop: new Enmap({ name: "mmshop" }),
  balances: new Enmap({ name: "balances" }),
  mmbalances: new Enmap({ name: "mmbalances" }),
};