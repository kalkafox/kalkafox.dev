// import { useEffect, useRef } from 'react'
// import { Terminal as Term } from '@xterm/xterm'
// import range from 'lodash.range'

// function Terminal() {
//   const terminalRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const term = new Term()

//     term.open(terminalRef.current!)

//     const prompt = () => {
//       term.write('\r\n$ ')
//     }

//     const evaluate = (cmd: string) => {
//       // Simple REPL: Echo the input command for demonstration
//       term.writeln(`\r\nYou entered: ${cmd}`)
//     }

//     term.open(terminalRef.current!)
//     range(term.rows - 1).forEach(() => term.write('\r\n'))
//     term.write('$ ')

//     let input = ''

//     term.onKey(({ key, domEvent }) => {
//       const printable =
//         !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey

//       if (domEvent.key === 'Enter') {
//         evaluate(input)
//         input = ''
//         prompt()
//       } else if (domEvent.key === 'Backspace') {
//         if (input.length > 0) {
//           input = input.slice(0, -1)
//           term.write('\b \b')
//         }
//       } else if (printable) {
//         input += key
//         term.write(key)
//       }
//     })

//     const resizeHandler = () => {
//       const { rows, cols } = term
//       term.resize(cols, rows)
//       term.scrollToBottom()
//       //prompt()
//     }

//     window.addEventListener('resize', resizeHandler)

//     return () => {
//       term.dispose()
//       window.removeEventListener('resize', resizeHandler)
//     }
//   }, [])

//   return <div ref={terminalRef}></div>
// }

// export default Terminal
