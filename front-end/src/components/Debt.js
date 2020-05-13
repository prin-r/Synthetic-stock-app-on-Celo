import React from 'react'
import { Flex, Text } from 'rebass'
import colors from 'ui/colors'

export default () => {
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
        <Text>100 SPX</Text>
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
        Collateral <Text>1000 cUSD</Text>
      </Flex>
      <Flex
        mt="2.0vw"
        justifyContent="space-between"
        style={{ fontSize: '0.95vw' }}
      >
        Debt <Text>100 SPX</Text>
      </Flex>
      <Flex mt="2.0vw" justifyContent="center" style={{ fontSize: '2.0vw' }}>
        <button>lock</button>
        <Flex mx="3.0vw" />
        <button>unlock</button>
      </Flex>
    </Flex>
  )
}
