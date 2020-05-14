import React, { useState, useRef } from 'react'
import './App.css'

import { Flex, Text } from 'rebass'

import theme from './ui/theme'
import colors from 'ui/colors'
import { ThemeProvider } from 'styled-components'
import CUSDFrame from './components/CUSDFrame'
import Liquidate from './components/Liquidate'
import Debt from './components/Debt'
import Log from './components/Log'

import { newCeloKit, sendApprove10M, getAllowance } from './utils/proof'

const isValidPk = (pk) => pk && pk.match(/^[0-9A-Fa-f]{64}$/g) !== null

export default () => {
  const kitRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(false)

  return !isLogin ? (
    <Flex
      mt="40.0vh"
      mx="auto"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      width="70vw"
    >
      {!isLoading ? (
        <button
          onClick={async () => {
            const pk = window.prompt('Login with your private key')
            if (!isValidPk(pk)) {
              alert('invalid private key format')
            } else {
              setIsLoading(true)
              kitRef.current = newCeloKit()
              kitRef.current.addAccount(pk)
              let alllowance = await getAllowance(kitRef.current)
              if (alllowance > 1000000) {
                console.log(alllowance)
              } else {
                await sendApprove10M(kitRef.current)
              }
              setIsLogin(true)
              setIsLoading(false)
            }
          }}
          style={{ padding: '1.0vw', borderRadius: '4px' }}
        >
          <Text fontSize="2.0vw">Login</Text>
        </button>
      ) : (
        <Text fontSize="2.0vw">Loading...</Text>
      )}
    </Flex>
  ) : (
    <ThemeProvider theme={theme}>
      <Flex
        mt="2.5vw"
        mx="auto"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="70vw"
      >
        <Flex flexDirection="row" width="100%">
          <Flex flex={1}>
            <Text
              fontSize="2.5vw"
              fontWeight={900}
              lineHeight="1.53vw"
              color={colors.purple.dark}
            >
              Stock CDP App
            </Text>
          </Flex>
          <Flex flex={1} />
        </Flex>
        <Flex
          mt="5.0vw"
          flexDirection="row"
          width="100%"
          justifyContent="space-between"
        >
          <Flex flexDirection="column">
            <CUSDFrame kitInst={kitRef.current} />
            <Flex mt="5.0vw" />
            <Liquidate kitInst={kitRef.current} />
            <Flex mt="5.0vw" />
            <Log />
          </Flex>
          <Flex>
            <Debt kitInst={kitRef.current} />
          </Flex>
        </Flex>
      </Flex>
      )
    </ThemeProvider>
  )
}
