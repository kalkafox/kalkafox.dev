import { isTouchDevice } from '@/util/touch'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Canvas } from '@react-three/fiber'
import { KalkaProtogen } from './kalka-protogen-mc-model'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { useEffect, useRef } from 'react'
import { useSetAtom } from 'jotai'
import { boundingClientRectAtom } from '@/util/atom'

export function Avatar() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  const setRect = useSetAtom(boundingClientRectAtom)

  useEffect(() => {
    const onResize = () => {
      setRect(avatarRef.current?.getBoundingClientRect())
    }

    window.addEventListener('resize', onResize)

    onResize()

    return () => window.removeEventListener('resize', onResize)
  }, [avatarRef.current])

  return (
    <div
      ref={avatarRef}
      className="border-full h-24 w-24 rounded-full border-2 border-white bg-neutral-800/20 backdrop-blur-lg"
    >
      {isTouchDevice() ? (
        <Popover>
          <PopoverTrigger>
            <Canvas className="rounded-full" ref={canvasRef}>
              <ambientLight />
              <KalkaProtogen />
            </Canvas>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-lg">
              Model by the amazing{' '}
              <a
                className="text-blue-300"
                href="https://sketchfab.com/Endles13"
              >
                Endles13!
              </a>
            </p>
          </PopoverContent>
        </Popover>
      ) : (
        <HoverCard>
          <HoverCardTrigger>
            <Canvas className="rounded-full" ref={canvasRef}>
              <ambientLight />
              <KalkaProtogen />
            </Canvas>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-lg">
              Model by the amazing{' '}
              <a
                className="text-blue-300"
                href="https://sketchfab.com/Endles13"
              >
                Endles13!
              </a>
            </p>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  )
}
