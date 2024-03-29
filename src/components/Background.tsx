import { Icon } from '@iconify/react'
import { useEffect, useRef } from 'react'

import images from '@/data/images.json'
import {
  bgImageAtom,
  bgPosAtom,
  loadedImagesAtom,
  previousPageAtom,
  showLoadSpinnerAtom,
} from '@/util/atom'
import { animated as a, useSpring, useTransition } from '@react-spring/web'
import { useAtom, useAtomValue } from 'jotai'

import Image from 'next/image'
import { useRouter } from 'next/router'

function Background({
  scale = 1.5,
  doResize = true,
  mod = 5000,
  amp = 100,
  x = 0,
  y = 0,
}: {
  scale?: number
  doResize?: boolean
  mod?: number
  amp?: number
  x?: number
  y?: number
}) {
  const router = useRouter()
  const [bgImage, setBgImage] = useAtom(bgImageAtom)

  const [loadedImages, setLoadedImages] = useAtom(loadedImagesAtom)

  const [previousPage, setPreviousPage] = useAtom(previousPageAtom)

  useEffect(() => {
    if (router.asPath.startsWith('/akunda')) {
      console.log('ya')
      setBgImage(images.bg_2)
    } else if (router.asPath.startsWith('/mcremote')) {
      console.log('ye')
      setBgImage(images.bg_3)
    } else if (router.asPath.startsWith('/')) {
      setBgImage(images.bg_1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  const [showLoadSpinner, setShowLoadSpinner] = useAtom(showLoadSpinnerAtom)

  const [imageMoveSpring, setImageMoveSpring] = useSpring(() => ({
    x: 0,
    y: 0,
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    },
  }))

  const imageTransition = useTransition(bgImage, {
    from: {
      opacity: 0,
      scale:
        previousPage === '/' || previousPage === '' ? scale - 0.2 : scale + 0.2,
    },
    enter: () => {
      if (!loadedImages.includes(bgImage)) {
        return {}
      }
      setShowLoadSpinner(false)
      return {
        opacity: 1,
        scale: scale,
      }
    },
    leave: {
      opacity: 0,
      scale: previousPage === '/' ? scale + 0.2 : scale - 0.2,
    },
  })

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setImageMoveSpring.start({
  //       x: Math.cos(Date.now() / mod) * amp,
  //       y: Math.sin(Date.now() / mod) * amp,
  //     })
  //   }, 10)
  //   return () => {
  //     clearInterval(interval)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    console.log('ayo')
    setImageMoveSpring.start({ x, y })
  }, [x, y])

  const imgRef = useRef<HTMLImageElement>(null)

  return (
    <>
      {showLoadSpinner && (
        <div className="fixed z-10 h-full w-full">
          <div className="fixed left-0 right-0 m-auto h-auto w-[40%] lg:w-[80%] portrait:w-[80%]">
            <div className="m-4 text-center">
              <div className="left-0 right-0 text-center">
                <Icon
                  className="fixed left-0 w-full animate-spin text-zinc-300"
                  width={24}
                  height={24}
                  icon="gg:spinner"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <a.div style={imageMoveSpring} className="fixed h-full w-full">
        {imageTransition((style, item, ts) => (
          <>
            <a.div className={`fixed h-full w-full object-cover`} style={style}>
              <Image
                ref={imgRef}
                src={item}
                alt="gilneas"
                fill
                priority
                quality={100}
                onLoadingComplete={(e) => {
                  console.log('hallo')
                  setShowLoadSpinner(false)
                  ts.ctrl.start({
                    opacity: 1,
                    scale: scale,
                  })
                  setLoadedImages((prev) => {
                    return [...prev, item as string]
                  })
                }}
                className="fixed h-screen w-screen bg-cover object-cover"
              />
            </a.div>
            <div
              className={`fixed -left-24 -top-24 h-[150%] w-[150%] bg-zinc-900/25 ${
                item === images.bg_1 ? 'backdrop-blur-md' : ''
              }`}
            />
          </>
        ))}
      </a.div>
    </>
  )
}

export default Background
