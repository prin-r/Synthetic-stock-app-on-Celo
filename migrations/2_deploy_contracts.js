const StockCDP = artifacts.require("StockCDP");

module.exports = function (deployer) {
  deployer.deploy(StockCDP);
};
