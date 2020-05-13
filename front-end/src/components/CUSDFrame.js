import React, { useEffect, useState } from 'react'
import { Flex, Text } from 'rebass'
import colors from 'ui/colors'
import { A } from 'components/A'
import { getAddress, getCUSDBalance } from '../utils/proof'

export default ({ kitInst }) => {
  const [cusd, setCUSD] = useState(-1)
  useEffect(() => {
    async function fetchData() {
      setCUSD(await getCUSDBalance(kitInst))
    }
    fetchData()
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
        <Text>Celo Dollar Balance</Text>

        <A href="https://celo.org/developers/faucet" style={{ color: 'white' }}>
          faucet
        </A>
      </Flex>
      <Flex
        mt="2.0vw"
        justifyContent="space-between"
        style={{ fontSize: '0.95vw' }}
      >
        Address <Text>{getAddress(kitInst)}</Text>
      </Flex>
      <Flex
        mt="1.0vw"
        justifyContent="space-between"
        style={{ fontSize: '0.95vw' }}
      >
        Amount <Text>{cusd < 0 ? 'loading...' : cusd} cUSD</Text>
      </Flex>
    </Flex>
  )
}
