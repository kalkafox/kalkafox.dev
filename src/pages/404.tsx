import { bgImageAtom, showLoadSpinnerAtom } from '@/util/atom'
import { poppins } from '@/util/font'
import { animated as a, useSpring } from '@react-spring/web'
import { useSetAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const CubeComponent = dynamic(() => import('@/components/Cube'), {
  ssr: false,
})

import images from '@/data/images.json'

function NotFound() {
  const router = useRouter()

  const setBgImage = useSetAtom(bgImageAtom)

  const setShowLoadSpinner = useSetAtom(showLoadSpinnerAtom)

  const [cubeVisible, setCubeVisible] = useState(false)

  const [notFoundSpring, setNotFoundSpring] = useSpring(() => ({
    from: {
      scale: 0.8,
      opacity: 0,
      display: 'none',
    },
    to: {
      scale: 1,
      opacity: 1,
      display: 'block',
    },
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    },
  }))

  useEffect(() => {
    setShowLoadSpinner(true)
    setTimeout(() => {
      setCubeVisible(true)
    }, 500)
    setBgImage(images.bg_404)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        className="fixed h-full w-full bg-zinc-800/80 mix-blend-overlay backdrop-blur-md"
      />
      <a.div
        style={notFoundSpring}
        className={`p-2 text-center ${poppins.className} absolute left-0 right-0 top-12 m-auto w-60 rounded-lg border bg-zinc-800/20 text-zinc-300 backdrop-blur-lg`}
      >
        <h1 className="text-4xl font-bold">404</h1>
        {cubeVisible && <CubeComponent />}
        <p>Whoops, that&apos;s an error.</p>
        <button
          className="mt-2 rounded-lg bg-zinc-300/20 p-2 transition-colors hover:bg-zinc-300/40"
          onClick={() => {
            setBgImage(images.bg_1)
            setBackdropSpring.start({
              opacity: 0,
            })
            setNotFoundSpring.start({
              opacity: 0,
              scale: 0.8,
              onChange: (e, ctrl) => {
                if (e.value.opacity < 0.5) {
                  ctrl.set({
                    opacity: 0,
                    scale: 0.8,
                  })
                  router.push('/')
                }
              },
            })
          }}
        >
          &gt; Home
        </button>
      </a.div>
    </>
  )
}

export default NotFound
