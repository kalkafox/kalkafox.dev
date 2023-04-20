import dynamic from 'next/dynamic'

import { useState } from 'react'

import { Icon } from '@iconify/react'
import { animated as a, useSpring } from '@react-spring/web'
import router from 'next/router'

const TerminalComponent = dynamic(() => import('@/components/Terminal'), {
  ssr: false,
})

function Terminal() {
  const [showTerminal, setShowTerminal] = useState(false)
  const [backdropSpring, setBackdropSpring] = useSpring(() => ({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    },
  }))
  return (
    <>
      <a.div
        style={backdropSpring}
        className="fixed h-full w-full bg-zinc-800 mix-blend-overlay backdrop-blur-md"
      />
      <div className="absolute grid h-full w-full items-center justify-center">
        <TerminalComponent />
      </div>
      <button
        onClick={() => {
          setBackdropSpring.start({
            opacity: 0,
            onRest: () => setShowTerminal(true),
          })
          router.back()
        }}
        className="absolute m-2 rounded-lg bg-zinc-800/50 p-2 backdrop-blur-lg"
      >
        <Icon
          icon="material-symbols:arrow-back"
          width={24}
          height={24}
          className="text-zinc-300"
        />
      </button>
    </>
  )
}

export default Terminal
