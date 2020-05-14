import bandchain from '@bandprotocol/bandchain-devnet'
import {
  balanceOf,
  cdps,
  approve10M,
  allowance,
  lock,
  unlock,
  borrow,
  returnDebt,
  transfer,
  liquidate,
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
  window.addLogs('start getting proof from bandchain')
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
  window.addLogs('proof size is ' + proof.length / 2 + 'bytes')
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
    return cusd
  } catch (e) {
    return -1
  }
}

const sendApprove10M = async (kitInst) => {
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
    return x
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
    return spx
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

const sendLock = async (kitInst, amount) => {
  window.addLogs('start sending lock tx')
  try {
    let tx = await kitInst.sendTransaction({
      from: '0x' + getAddress(kitInst),
      to: '0x3ffBc08b878D489fec0c80fa65C9B3933B361764',
      data: lock(amount),
      gas: '8000000',
    })

    const receipt = await tx.waitReceipt()
    window.addLogs('tx hash is ' + receipt['transactionHash'].trim())
  } catch (e) {
    window.addLogs('fail to lock :' + JSON.stringify(e.message))
  }
}

const sendUnlock = async (kitInst, amount) => {
  window.addLogs('start sending unlock tx')
  try {
    const proof = await requestAndGetProof()
    let tx = await kitInst.sendTransaction({
      from: '0x' + getAddress(kitInst),
      to: '0x3ffBc08b878D489fec0c80fa65C9B3933B361764',
      data: unlock(amount, proof),
      gas: '8000000',
    })

    const receipt = await tx.waitReceipt()
    window.addLogs('tx hash is ' + receipt['transactionHash'].trim())
  } catch (e) {
    window.addLogs('fail to unlock :' + JSON.stringify(e.message))
  }
}

const sendBorrow = async (kitInst, amount) => {
  window.addLogs('start sending borrow tx')
  try {
    const proof = await requestAndGetProof()
    let tx = await kitInst.sendTransaction({
      from: '0x' + getAddress(kitInst),
      to: '0x3ffBc08b878D489fec0c80fa65C9B3933B361764',
      data: borrow(amount, proof),
      gas: '8000000',
    })

    const receipt = await tx.waitReceipt()
    window.addLogs('tx hash is ' + receipt['transactionHash'].trim())
  } catch (e) {
    window.addLogs('fail to borrow :' + JSON.stringify(e.message))
  }
}

const sendReturnDebt = async (kitInst, amount) => {
  window.addLogs('start sending returnDebt tx')
  try {
    let tx = await kitInst.sendTransaction({
      from: '0x' + getAddress(kitInst),
      to: '0x3ffBc08b878D489fec0c80fa65C9B3933B361764',
      data: returnDebt(amount),
      gas: '8000000',
    })

    const receipt = await tx.waitReceipt()
    window.addLogs('tx hash is ' + receipt['transactionHash'].trim())
  } catch (e) {
    window.addLogs('fail to return debt :' + JSON.stringify(e.message))
  }
}

const sendTransfer = async (kitInst, toAddress, amount) => {
  window.addLogs('start sending transfer tx')
  try {
    let tx = await kitInst.sendTransaction({
      from: '0x' + getAddress(kitInst),
      to: '0x3ffBc08b878D489fec0c80fa65C9B3933B361764',
      data: transfer(toAddress, amount),
      gas: '8000000',
    })

    const receipt = await tx.waitReceipt()
    window.addLogs('tx hash is ' + receipt['transactionHash'].trim())
  } catch (e) {
    window.addLogs('fail to transfer :' + JSON.stringify(e.message))
  }
}

const sendLiquidate = async (kitInst, who) => {
  window.addLogs('start sending liquidate tx')
  try {
    const proof = await requestAndGetProof()
    let tx = await kitInst.sendTransaction({
      from: '0x' + getAddress(kitInst),
      to: '0x3ffBc08b878D489fec0c80fa65C9B3933B361764',
      data: liquidate(who, proof),
      gas: '8000000',
    })

    const receipt = await tx.waitReceipt()
    window.addLogs('tx hash is ' + receipt['transactionHash'].trim())
  } catch (e) {
    window.addLogs('fail to liquidate :' + JSON.stringify(e.message))
  }
}

export {
  sendApprove10M,
  requestAndGetProof,
  newCeloKit,
  getAllowance,
  getCUSDBalance,
  getSPXBalance,
  getAddress,
  getCDP,
  sendLock,
  sendUnlock,
  sendBorrow,
  sendReturnDebt,
  sendTransfer,
  sendLiquidate,
}
