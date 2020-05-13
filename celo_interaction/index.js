const Kit = require("@celo/contractkit");

// create new kit object with rpc url
const kit = Kit.newKit("https://alfajores-forno.celo-testnet.org");

const deployBridgeData = require("./tx_data/deployBridge.js");
const deployCDPData = require("./tx_data/deployCDP.js");
const approveCDP = require("./tx_data/approveCDP.js");
const lockCollateral = require("./tx_data/lockCollateral.js");
const borrow = require("./tx_data/borrow.js");
const returnDebt = require("./tx_data/returnDebt.js");
const unlockCollateral = require("./tx_data/unlockCollateral.js");
const liquidate = require("./tx_data/liquidate.js");

const deployBridgeObj = {
  from: "0x498968C2B945Ac37b78414f66167b0786E522636",
  // Bridge contract bytescode which is copy from Metamask transaction data.
  gas: "8000000",
  data: deployBridgeData,
};

const deployCDPObj = {
  from: "0x498968C2B945Ac37b78414f66167b0786E522636",
  // CDP contract bytescode which is copy from Metamask transaction data.
  gas: "8000000",
  data: deployCDPData,
};

const approveCDPObj = {
  from: "0x498968C2B945Ac37b78414f66167b0786E522636",
  // Address of Celo dollar in Alfajores
  to: "0xa561131a1C8aC25925FB848bCa45A74aF61e5A38",
  data: approveCDP,
  gas: "8000000",
};

const lockCollateralObj = {
  from: "0x498968C2B945Ac37b78414f66167b0786E522636",
  // Address of Celo dollar in Alfajores
  to: "0x3ffBc08b878D489fec0c80fa65C9B3933B361764",
  data: lockCollateral,
  gas: "8000000",
};

const borrowObj = {
  from: "0x498968C2B945Ac37b78414f66167b0786E522636",
  // Address of Celo dollar in Alfajores
  to: "0x3ffBc08b878D489fec0c80fa65C9B3933B361764",
  data: borrow,
  gas: "8000000",
};

const returnDebtObj = {
  from: "0x498968C2B945Ac37b78414f66167b0786E522636",
  // Address of Celo dollar in Alfajores
  to: "0x3ffBc08b878D489fec0c80fa65C9B3933B361764",
  data: returnDebt,
  gas: "8000000",
};

const unlockCollateralObj = {
  from: "0x498968C2B945Ac37b78414f66167b0786E522636",
  // Address of Celo dollar in Alfajores
  to: "0x3ffBc08b878D489fec0c80fa65C9B3933B361764",
  data: unlockCollateral,
  gas: "8000000",
};

const liquidateObj = {
  from: "0x498968C2B945Ac37b78414f66167b0786E522636",
  // Address of Celo dollar in Alfajores
  to: "0x3ffBc08b878D489fec0c80fa65C9B3933B361764",
  data: liquidate,
  gas: "8000000",
};

async function awaitWrapper() {
  kit.addAccount(
    "4CF1708A683743E6D9E2DF3CCCF657FED1D48A33F48DA1C7E05C76267AF35224",
  );
  // This account must have a cGLD balance to pay transaction fees.

  let tx = await kit.sendTransaction(unlockCollateralObj);

  const receipt = await tx.waitReceipt();
  console.log(receipt);
}

awaitWrapper();
