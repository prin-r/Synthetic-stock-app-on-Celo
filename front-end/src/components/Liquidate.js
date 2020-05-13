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
        <Text>Dangerous zone</Text>
      </Flex>
      <Flex mt="2.0vw" justifyContent="space-between">
        <button>liquidate undercollateralized loan</button>
      </Flex>
    </Flex>
  )
}
