import { useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'

import { bgImageAtom, previousPageAtom, showLoadSpinnerAtom } from '@/util/atom'

import images from '@/data/images.json'

import { animated as a, useSpring } from '@react-spring/web'
import { useEffect } from 'react'

function MCRemote() {
  const router = useRouter()
  const [previousPage, setPreviousPage] = useAtom(previousPageAtom)
  const setBgImage = useSetAtom(bgImageAtom)

  const setShowLoadSpinner = useSetAtom(showLoadSpinnerAtom)

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

  useEffect(() => {
    setShowLoadSpinner(true)
    setBgImage(images.bg_3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <a.div
        style={backdropSpring}
        className="absolute h-full w-full bg-zinc-800 mix-blend-overlay backdrop-blur-md"
      ></a.div>
      <div className="absolute h-full w-full">
        <h1>MCRemote</h1>
        <button
          onClick={() => {
            setPreviousPage(router.pathname)
            setBgImage(images.bg_1)
            router.back()
          }}
          className="rounded bg-zinc-800/25 px-4 py-2 font-bold text-zinc-300 backdrop-blur-md transition-colors hover:bg-zinc-700"
        >
          Go back
        </button>
      </div>
    </>
  )
}

export default MCRemote
