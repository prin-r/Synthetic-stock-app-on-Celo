import React, { useState, useEffect } from 'react'
import { Flex, Text } from 'rebass'
import colors from 'ui/colors'

export default () => {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    window.addLogs = (newLog) => {
      if (typeof newLog === 'string') {
        setLogs([...logs, newLog])
      } else {
        setLogs([...logs, JSON.stringify(newLog)])
      }
    }
  }, [logs.length])

  return (
    <Flex
      flexDirection="column"
      style={{
        padding: '1.0vw',
        border: '1px solid #333333',
        minWidth: '32.0vw',
        maxHeight: '32.0vh',
        borderRadius: '4px',
        overflow: 'scroll',
      }}
    >
      <Flex
        backgroundColor={colors.pink.dark}
        justifyContent="space-between"
        style={{ color: 'white', margin: '-1.0vw', padding: '1.0vw' }}
      >
        <Text>Logs</Text>
      </Flex>
      <Flex
        mt="2.0vh"
        flexDirection="column"
        style={{ maxWidth: '32.0vw', overflow: 'scroll' }}
      >
        {logs.map((log, i) => (
          <Flex key={i} mt="1.75vw" justifyContent="space-between">
            <Text fontSize="0.9vw" color="#333333">
              {log}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
