import { createLazyFileRoute } from '@tanstack/react-router'

import { Icon } from '@iconify-icon/react'
import { PrideFlag } from '@/components/pride-flag'
import { KalkaMCModel } from '@/components/kalka-mc-model'
import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { useSetAtom } from 'jotai'
import { docRefAtom } from '@/util/atom'
import { animated, useSpring } from '@react-spring/web'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

const splashes = [
  'Hi there!',
  'Bork!',
  'Hello!',
  'Hola!',
  'Bonjour!',
  'Ciao!',
  'Hallo!',
  'Olá!',
  'Привет!',
  'नमस्ते!',
  'こんにちは!',
  '안녕하세요!',
  '你好!',
  'مرحبا!',
  'Salam!',
  'Hei!',
  'Hej!',
  'Merhaba!',
  'Sawubona!',
  'Shalom!',
  'Γειά σου!',
  'Aloha!',
  'Sawasdee!',
  'Selamat!',
  'Kia ora!',
  'Tere!',
  'Zdravo!',
  'Sveiki!',
  'Ahoj!',
  'Salut!',
]

function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [_nextSplash, _setNextSplash] = useState('')

  const [splash, setSplash] = useState(splashes[0])

  const [splashSpring, _splashSpringApi] = useSpring(() => ({
    y: 0,
    opacity: 1,
  }))

  const titleRef = useRef<HTMLDivElement>(null)

  const setRef = useSetAtom(docRefAtom)

  setRef(canvasRef)

  useEffect(() => {
    splashSpring.y.start(0)
    splashSpring.opacity.start(1)
    const interval = setInterval(async () => {
      await Promise.all([
        splashSpring.y.start(-20),
        splashSpring.opacity.start(0),
      ])
      splashSpring.y.set(20)

      setSplash(splashes[Math.floor(Math.random() * splashes.length)])

      splashSpring.y.start(0)
      splashSpring.opacity.start(1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="font-['Urbanist']">
      <div className="flex flex-1 flex-col items-start">
        <div ref={titleRef} className="flex items-center gap-x-2 py-4 text-4xl">
          <div className="border-full h-24 w-24 rounded-full border-2 border-white">
            <Canvas className="rounded-full" ref={canvasRef}>
              <ambientLight />
              <KalkaMCModel />
            </Canvas>
          </div>
          <Icon icon="mdi:paw" className="inline -rotate-12" />
          {/* <p>Hi there!</p> */}
          <animated.p style={splashSpring}>{splash}</animated.p>
          <div className="absolute right-0 m-8">
            <PrideFlag />
          </div>
        </div>
        <p className="text-lg">
          I make things go beep boop. This site serves as a placeholder for some
          of my web dev practice, as well as any projects I intend to showcase.
        </p>
        <p className="my-2 text-lg">
          I am a self-taught developer. For the most part, I find myself
          sketching out ideas or writing prototypes in many different areas.
          Thanks to many open source libraries, I am able to experiment and
          tinker around with things that pique my interest.
        </p>
        <p className="my-2 text-lg">
          My future plans involve integrating some sort of blog where I can post
          stuff (and work out some different designs too!)
        </p>
        <p className="my-2 text-lg">
          Most of what you see will probably be barren or otherwise works in
          progress, but feel free to look around!
        </p>
      </div>
    </div>
  )
}
