import bandchain from '@bandprotocol/bandchain-devnet'
import {
  balanceOf,
  cdps,
  approve10M,
  allowance,
  lock,
  unlock,
} from './calldata'

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
        data: balanceOf(getAddress(kitInst)),
      }),
    )
    return cusd / 1e18
  } catch (e) {
    return -1
  }
}

const sentApprove10M = async (kitInst) => {
  let tx = await kitInst.sendTransaction({
    from: '0x' + getAddress(kitInst),
    to: '0xa561131a1C8aC25925FB848bCa45A74aF61e5A38',
    data: approve10M(),
    gas: '8000000',
  })

  const receipt = await tx.waitReceipt()
  return receipt
}

const getAllowance = async (kitInst) => {
  try {
    const x = Number(
      await kitInst.web3.eth.call({
        to: '0xa561131a1C8aC25925FB848bCa45A74aF61e5A38',
        data: allowance(getAddress(kitInst)),
      }),
    )
    return x / 1e18
  } catch (e) {
    return -1
  }
}

const getSPXBalance = async (kitInst) => {
  try {
    const spx = Number(
      await kitInst.web3.eth.call({
        to: '0x3ffBc08b878D489fec0c80fa65C9B3933B361764',
        data: balanceOf(getAddress(kitInst)),
      }),
    )
    return spx / 1e18
  } catch (e) {
    return -1
  }
}

const getCDP = async (kitInst) => {
  let cdp = (
    await kitInst.web3.eth.call({
      to: '0x3ffBc08b878D489fec0c80fa65C9B3933B361764',
      data: cdps(getAddress(kitInst)),
    })
  ).toString()
  if (cdp.length === 130) {
    cdp = cdp.slice(2)
    return [Number('0x' + cdp.slice(0, 64)), Number('0x' + cdp.slice(64))]
  }
  return [0, 0]
}

const sentLock = async (kitInst, amount) => {
  let tx = await kitInst.sendTransaction({
    from: '0x' + getAddress(kitInst),
    to: '0x3ffBc08b878D489fec0c80fa65C9B3933B361764',
    data: lock(amount),
    gas: '8000000',
  })

  const receipt = await tx.waitReceipt()
  return receipt
}

const sentUnlock = async (kitInst, amount) => {
  const proof = await requestAndGetProof()
  let tx = await kitInst.sendTransaction({
    from: '0x' + getAddress(kitInst),
    to: '0x3ffBc08b878D489fec0c80fa65C9B3933B361764',
    data: unlock(amount, proof),
    gas: '8000000',
  })

  const receipt = await tx.waitReceipt()
  return receipt
}

export {
  sentApprove10M,
  requestAndGetProof,
  newCeloKit,
  getAllowance,
  getCUSDBalance,
  getSPXBalance,
  getAddress,
  getCDP,
  sentLock,
  sentUnlock,
}
