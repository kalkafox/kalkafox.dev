import { useEffect, useRef } from 'react'

import { Terminal as T } from 'xterm'

function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      const terminal = new T({
        cursorBlink: true,
        theme: {
          background: '#000000',
        },
      })

      terminal.open(terminalRef.current)

      terminal.write('Hullo, work in progress! uwu')

      return () => {
        terminal.dispose()
      }
    }
  }, [])

  return (
    <>
      <div ref={terminalRef} />
    </>
  )
}

export default Terminal
