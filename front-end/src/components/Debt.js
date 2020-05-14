import React, { useEffect, useState } from 'react'
import { Flex, Text } from 'rebass'
import colors from 'ui/colors'

import {
  getSPXBalance,
  getCDP,
  sendLock,
  sendUnlock,
  sendBorrow,
  sendReturnDebt,
  sendTransfer,
} from '../utils/proof'

export default ({ kitInst }) => {
  const [spx, setSPX] = useState(-1)
  const [cdp, setCPD] = useState([-1, -1])
  useEffect(() => {
    async function fetchData() {
      const [x1, x2] = await Promise.all([
        getSPXBalance(kitInst),
        getCDP(kitInst),
      ])
      setSPX(x1)
      setCPD(x2)
    }
    fetchData()
    const itid = setInterval(fetchData, 3000)
    return () => clearInterval(itid)
  }, [])

  return (
    <Flex
      flexDirection="column"
      style={{
        padding: '1.0vw',
        border: '1px solid #333333',
        minWidth: '32.0vw',
        borderRadius: '4px',
      }}
    >
      <Flex
        backgroundColor={colors.pink.dark}
        justifyContent="space-between"
        style={{ color: 'white', margin: '-1.0vw', padding: '1.0vw' }}
      >
        <Text>Synthetic Stock Balance</Text>
        <Flex />
      </Flex>
      <Flex mt="3.0vw" justifyContent="center" style={{ fontSize: '2.0vw' }}>
        <Text>{spx < 0 ? 'loading...' : spx} SPX</Text>
      </Flex>
      <Flex mt="2.0vw" justifyContent="center" style={{ fontSize: '2.0vw' }}>
        <button
          onClick={async () => {
            const amount = window.prompt('Amount of SPX to be borrowed')
            await sendBorrow(kitInst, amount)
          }}
        >
          borrow
        </button>
        <Flex mx="1.5vw" />
        <button
          onClick={async () => {
            const amount = window.prompt(
              'Amount of SPX (debt) you want to return',
            )
            await sendReturnDebt(kitInst, amount)
          }}
        >
          return debt
        </button>
        <Flex mx="1.5vw" />
        <button
          onClick={async () => {
            const toAddress = window.prompt('Transfer to address')
            if (!toAddress || !toAddress.match(/^[0-9A-Fa-f]{40}$/g)) {
              alert('wrong format, address must be 40hex without 0x prefix')
              return
            }
            const amount = window.prompt(
              'Amount of SPX (debt) you want to return',
            )
            await sendTransfer(kitInst, toAddress, amount)
          }}
        >
          send
        </button>
      </Flex>
      <Flex
        mt="2.0vw"
        justifyContent="space-between"
        style={{ fontSize: '0.95vw' }}
      >
        Collateral <Text>{cdp[0] < 0 ? 'loading...' : cdp[0]} cUSD</Text>
      </Flex>
      <Flex
        mt="2.0vw"
        justifyContent="space-between"
        style={{ fontSize: '0.95vw' }}
      >
        Debt <Text>{cdp[1] < 0 ? 'loading...' : cdp[1]} SPX</Text>
      </Flex>
      <Flex mt="2.0vw" justifyContent="center" style={{ fontSize: '2.0vw' }}>
        <button
          onClick={async () => {
            const amount = window.prompt('Amount of Celo Dollar to be locked')
            await sendLock(kitInst, amount)
          }}
        >
          lock
        </button>
        <Flex mx="3.0vw" />
        <button
          onClick={async () => {
            const amount = window.prompt('Amount of Celo Dollar to be unlocked')
            await sendUnlock(kitInst, amount)
          }}
        >
          unlock
        </button>
      </Flex>
    </Flex>
  )
}
