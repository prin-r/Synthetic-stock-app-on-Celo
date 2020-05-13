const axios = require('axios')
const borsh = require('borsh')
const cosmosjs = require('@cosmostation/cosmosjs')

const chainID = 'band-guanyu-alchemist'
const endpoint = 'http://devnet.bandchain.org/rest'

function borshEncode(_schema, cls, data) {
  let dict = {}
  function gen(members) {
    return function (args) {
      for (let i in members) {
        this[members[i]] = args[members[i]]
      }
    }
  }
  try {
    let schema = JSON.parse(_schema)
    let schemaMap = new Map()
    for (let className in schema) {
      let t = JSON.parse(schema[className])
      if (t.kind == 'struct') {
        dict[className] = gen(t.fields.map((x) => x[0]))
        t.fields = t.fields.map((x) => {
          x[1] = x[1].replace(/^\w/, (c) => c.toUpperCase())
          return x
        })
        schemaMap.set(dict[className], t)
      }
    }

    let rawValue = {}
    let specs = schemaMap.get(dict[cls])

    if (!specs.fields) return undefined

    for (let i in data) {
      let isFound = specs.fields.some((x) => x[0] == data[i].fieldName)
      if (!isFound) return undefined

      rawValue[data[i].fieldName] = data[i].fieldValue
    }
    let value = new dict[cls](rawValue)

    if (specs.fields.length !== data.length) return undefined

    let buf = borsh.serialize(schemaMap, value)
    return Buffer.from(buf)
  } catch (err) {
    return undefined
  }
}

function getStockPriceCalldata(schema, cls, symbol, multiplier) {
  const data = [
    { fieldName: 'symbol', fieldValue: symbol },
    { fieldName: 'multiplier', fieldValue: String(multiplier) },
  ]
  return borshEncode(schema, cls, data)
}

function convertSignedMsg(signedMsg) {
  for (const sig of signedMsg.tx.signatures) {
    sig.pub_key = Buffer.from(
      'eb5ae98721' + Buffer.from(sig.pub_key.value, 'base64').toString('hex'),
      'hex',
    ).toString('base64')
  }
}

function createRequestMsg(cosmos, account, sender, oracleScriptID, calldata) {
  let msg = cosmos.newStdMsg({
    msgs: [
      {
        type: 'oracle/Request',
        value: {
          oracle_script_id: oracleScriptID,
          calldata: Buffer.from(calldata).toString('base64'),
          ask_count: '4',
          min_count: '1',
          client_id: '12234s',
          sender: sender,
        },
      },
    ],
    chain_id: chainID,
    fee: {
      amount: [{ amount: '100', denom: 'uband' }],
      gas: '380000',
    },
    memo: '',
    account_number: String(account.result.value.account_number),
    sequence: String(account.result.value.sequence || 0),
  })
  return msg
}

async function sendRequestMsg(mnemonic, chainID, oracleScriptID, calldata) {
  let cosmos = cosmosjs.network(endpoint, chainID)
  cosmos.setPath("m/44'/494'/0'/0/0")
  cosmos.setBech32MainPrefix('band')

  const sender = cosmos.getAddress(mnemonic)
  const ecpairPriv = cosmos.getECPairPriv(mnemonic)
  const account = await cosmos.getAccounts(sender)

  let msgRequest = createRequestMsg(
    cosmos,
    account,
    sender,
    oracleScriptID,
    calldata,
  )
  let signedTx = cosmos.sign(msgRequest, ecpairPriv, 'block')
  convertSignedMsg(signedTx)

  const broadcastResponse = await cosmos.broadcast(signedTx)
  return broadcastResponse
}

async function sendRequestAndGetProofBytes(mnemonic, oracleScriptID, calldata) {
  let broadcastResponse = await sendRequestMsg(
    mnemonic,
    chainID,
    oracleScriptID,
    calldata,
  )

  return new Promise(async (resolve, _) => {
    let rawLog = JSON.parse(broadcastResponse.raw_log)
    let requestID = rawLog[0].events[2].attributes[0].value
    let fetchProof = setInterval(async () => {
      try {
        let res = await axios.get(endpoint + '/bandchain/proof/' + requestID)
        if (res.status == 200) {
          let evmProof = res.data.result.evmProofBytes
          clearInterval(fetchProof)
          resolve(evmProof)
        }
      } catch {}
    }, 500)
  })
}

exports.getStockPriceCalldata = getStockPriceCalldata
exports.sendRequestAndGetProofBytes = sendRequestAndGetProofBytes
