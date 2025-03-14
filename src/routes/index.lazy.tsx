import { createLazyFileRoute } from '@tanstack/react-router'

import { Icon } from '@iconify-icon/react'
import { PrideFlag } from '@/components/pride-flag'
import { useEffect, useRef, useState } from 'react'
import { useSetAtom } from 'jotai'
import { docRefAtom } from '@/util/atom'
import { animated, useSpring } from '@react-spring/web'
import { Avatar } from '@/components/avatar'

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
          <Avatar />
          <Icon icon="mdi:paw" className="inline -rotate-12" />
          {/* <p>Hi there!</p> */}
          <animated.p style={splashSpring}>{splash}</animated.p>
          {/* {transitions((style, item, transition, key) => (
            <animated.div key={key} style={style}>
              {item}
            </animated.div>
          ))} */}
          <div className="absolute right-0 m-8">
            <PrideFlag />
          </div>
        </div>
        <p className="text-lg">
          I make things go beep boop. This site serves as a placeholder for some
          of my web development practice, as well as for any projects I intend
          to showcase.
        </p>
        <p className="my-2 text-lg">
          I am a self-taught developer. For the most part, I find myself
          sketching out ideas or writing prototypes in various areas. Thanks to
          numerous open-source libraries, I can experiment and tinker with
          things that pique my interest. In my free time, I enjoy many hobbies,
          like gaming and radio.
        </p>
        <p className="my-2 text-lg">
          In the future, I plan to integrate a blog where I can share my work
          and experiment with different designs.
        </p>
        <p className="my-2 text-lg">
          Most of what you see is still a work in progress, but feel free to
          look around!
        </p>
      </div>
    </div>
  )
}
