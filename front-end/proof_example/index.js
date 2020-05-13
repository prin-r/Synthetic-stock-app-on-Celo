const bandchain = require("./proof.js");

const mnemonic =
  "bread april ozone mixed off crowd three zone scorpion almost depend satisfy swim chair step reject pipe evolve floor split fatigue sun hobby half";
const oracleScriptID = "12";
const symbol = "^GSPC";
const multiplier = 100;
const schema = `{"Input":"{ \\"kind\\": \\"struct\\", \\"fields\\": [ [\\"symbol\\", \\"string\\"], [\\"multiplier\\", \\"u64\\"] ] }","Output":"{ \\"kind\\": \\"struct\\", \\"fields\\": [ [\\"px\\", \\"u64\\"] ] }"}`;

(async () => {
  let calldata = bandchain.getStockPriceCalldata(
    schema,
    "Input",
    symbol,
    multiplier,
  );
  let proof = await bandchain.sendRequestAndGetProofBytes(
    mnemonic,
    oracleScriptID,
    calldata,
  );
  console.log(proof);
})();
