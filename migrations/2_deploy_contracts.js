const StockCDP = artifacts.require("StockCDP");

module.exports = function (deployer) {
  deployer.deploy(
    StockCDP,
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    12,
    "^GSPC",
    100,
  );
};
