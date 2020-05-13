import React, { useEffect, useState } from 'react'
import { Flex, Text } from 'rebass'
import colors from 'ui/colors'

import { getSPXBalance, getCDP, sentLock, sentUnlock } from '../utils/proof'

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
        <button>borrow</button>
        <Flex mx="1.5vw" />
        <button>return debt</button>
        <Flex mx="1.5vw" />
        <button>send</button>
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
            const amount = window.prompt('Amount of Celo Dollar')
            await sentLock(kitInst, amount)
          }}
        >
          lock
        </button>
        <Flex mx="3.0vw" />
        <button>unlock</button>
      </Flex>
    </Flex>
  )
}
