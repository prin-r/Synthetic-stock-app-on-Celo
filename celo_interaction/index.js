const Kit = require("@celo/contractkit");

// create new kit object with rpc url
const kit = Kit.newKit("https://alfajores-forno.celo-testnet.org");

const deployBridgeData = require("./tx_data/deployBridge.js");
const deployCDPData = require("./tx_data/deployCDP.js");
const relayAndVerifyData = require("./tx_data/relayAndVerify");

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

const relayAndVerifyObj = {
  from: "0x498968C2B945Ac37b78414f66167b0786E522636",
  to: "0x0A2acDeA5d23e45d2b5919d5aBdF7CA1088d907b",
  // Calldata of relayAndVerify function which is copy from Metamask transaction data.
  data: relayAndVerifyData,
  gas: "8000000",
};

async function awaitWrapper() {
  kit.addAccount(
    "4CF1708A683743E6D9E2DF3CCCF657FED1D48A33F48DA1C7E05C76267AF35224",
  );
  // This account must have a cGLD balance to pay transaction fees.

  let tx = await kit.sendTransaction(deployBridgeObj);

  // let tx = await kit.sendTransaction(relayAndVerifyObj);

  const receipt = await tx.waitReceipt();
  console.log(receipt);
}

awaitWrapper();
