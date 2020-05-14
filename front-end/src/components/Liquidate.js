import React from 'react'
import { Flex, Text } from 'rebass'
import colors from 'ui/colors'

import { sendLiquidate } from '../utils/proof'

export default ({ kitInst }) => {
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
        <button
          onClick={async () => {
            const who = window.prompt('Who(address) to be liquidated')
            if (!who || !who.match(/^[0-9A-Fa-f]{40}$/g)) {
              alert('wrong format, address must be 40hex without 0x prefix')
              return
            }
            await sendLiquidate(kitInst, who)
          }}
        >
          liquidate undercollateralized loan
        </button>
      </Flex>
    </Flex>
  )
}
