import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'

import images from '@/data/images.json'
import { useSpring, animated as a, useTransition } from '@react-spring/web'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { bgImageAtom, loadedImagesAtom } from '@/util/atom'

import Image from 'next/image'
import { useRouter } from 'next/router'

function Background({
  scale = 1.5,
  doResize = true,
  mod = 5000,
  amp = 100,
}: {
  scale?: number
  doResize?: boolean
  mod?: number
  amp?: number
}) {
  const router = useRouter()
  const [bgImage, setBgImage] = useAtom(bgImageAtom)

  useEffect(() => {
    if (router.asPath.startsWith('/akunda')) {
      setBgImage(images.bg_2)
    } else if (router.asPath.startsWith('/')) {
      setBgImage(images.bg_1)
    }
  })

  const setLoadedImages = useSetAtom(loadedImagesAtom)
  const [showLoadSpinner, setShowLoadSpinner] = useState(true)

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
    from: { opacity: 0, scale: scale - 0.2 },
    enter: { opacity: 1, scale: scale },
    leave: { opacity: 0, scale: scale + 0.2 },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setImageMoveSpring.start({
        x: Math.cos(Date.now() / mod) * amp,
        y: Math.sin(Date.now() / mod) * amp,
      })
    }, 10)
    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const imgRef = useRef<HTMLImageElement>(null)

  return (
    <>
      {showLoadSpinner && (
        <div className='fixed h-full w-full'>
          <div className='fixed left-0 right-0 top-20 m-auto h-auto w-[40%] lg:w-[80%] portrait:w-[80%]'>
            <div className='m-4 text-center'>
              <div className='left-0 right-0 text-center'>
                <Icon
                  className='fixed left-0 w-full animate-spin text-zinc-300'
                  width={24}
                  height={24}
                  icon='gg:spinner'
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <a.div style={imageMoveSpring} className='fixed h-full w-full'>
        {imageTransition((style, item, ts) => (
          <>
            <a.div className={`fixed h-full w-full object-cover`} style={style}>
              <Image
                ref={imgRef}
                src={item}
                alt='gilneas'
                fill
                priority
                quality={100}
                onLoadingComplete={(e) => {
                  setLoadedImages((prev) => {
                    return [...prev, e.currentSrc as string]
                  })
                }}
                className='fixed h-screen w-screen bg-cover object-cover'
              />
            </a.div>
            <div
              className={`fixed h-[150%] w-[150%] -top-24 bg-zinc-900/25 ${
                item === images.bg_1 ? 'backdrop-blur-sm' : ''
              }`}
            />
          </>
        ))}
      </a.div>
    </>
  )
}

export default Background
