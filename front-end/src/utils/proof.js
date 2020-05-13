import bandchain from '@bandprotocol/bandchain-devnet'
import { post } from 'axios'
const Kit = require('@celo/contractkit')

const rpcURL = 'http://localhost:8010/'

const mnemonic =
  'bread april ozone mixed off crowd three zone scorpion almost depend satisfy swim chair step reject pipe evolve floor split fatigue sun hobby half'
const oracleScriptID = '12'
const symbol = '^GSPC'
const multiplier = 100
const schema = `{"Input":"{ \\"kind\\": \\"struct\\", \\"fields\\": [ [\\"symbol\\", \\"string\\"], [\\"multiplier\\", \\"u64\\"] ] }","Output":"{ \\"kind\\": \\"struct\\", \\"fields\\": [ [\\"px\\", \\"u64\\"] ] }"}`

const requestAndGetProof = async () => {
  let calldata = bandchain.getStockPriceCalldata(
    schema,
    'Input',
    symbol,
    multiplier,
  )
  let proof = await bandchain.sendRequestAndGetProofBytes(
    mnemonic,
    oracleScriptID,
    calldata,
  )
  return proof
}

const newCeloKit = () => Kit.newKit(rpcURL)

const getAddress = (kitInst) =>
  kitInst.web3.givenProvider.selectedAddress.slice(2)

const getCUSDBalance = async (kitInst) => {
  try {
    const cusd = Number(
      await kitInst.web3.eth.call({
        to: '0xa561131a1C8aC25925FB848bCa45A74aF61e5A38',
        data:
          '0x70a08231000000000000000000000000498968c2b945ac37b78414f66167b0786e522636',
      }),
    )
    return cusd / 1e18
  } catch (e) {
    return -1
  }
}

export { requestAndGetProof, newCeloKit, getCUSDBalance, getAddress }
