import { Canvas } from '@react-three/fiber'
import KalkaProtogenModel from './kalka-protogen-model'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { isTouchDevice } from '@/lib/touch'
import { Suspense, useEffect, useRef } from 'react'
import { EffectComposer, FXAA } from '@react-three/postprocessing'
import { motion } from 'motion/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { boundingClientRectAtom, modelReadyAtom } from '@/lib/atom'

function Hover({ content }: Readonly<{ content: React.ReactNode }>) {
  const Wrapper = isTouchDevice() ? Popover : HoverCard
  const Trigger = isTouchDevice() ? PopoverTrigger : HoverCardTrigger
  const Content = isTouchDevice() ? PopoverContent : HoverCardContent

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const setBoundingClientRect = useSetAtom(boundingClientRectAtom)

  useEffect(() => {
    setBoundingClientRect(canvasRef.current?.getBoundingClientRect())
  }, [canvasRef, setBoundingClientRect])

  return (
    <Wrapper>
      <Trigger>
        <div className="h-24 w-24 sm:h-24 sm:w-24 lg:h-36 lg:w-36">
          <Canvas ref={canvasRef} className="rounded-full">
            <Suspense fallback={null}>
              <ambientLight />
              <KalkaProtogenModel />
              <EffectComposer multisampling={0}>
                <FXAA />
              </EffectComposer>
            </Suspense>
          </Canvas>
        </div>
      </Trigger>
      <Content>{content}</Content>
    </Wrapper>
  )
}

function Avatar() {
  const modelReady = useAtomValue(modelReadyAtom)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: modelReady ? 1 : 0, y: modelReady ? -10 : 0 }}
      className="border-full overflow-hidden rounded-full border-2 border-neutral-300 bg-neutral-800/20 backdrop-blur-lg"
    >
      <Hover
        content={
          <p className="text-lg">
            Model by the amazing{' '}
            <a
              target="_blank"
              className="text-blue-300"
              href="https://sketchfab.com/Endles13"
            >
              Endles13!
            </a>
          </p>
        }
      />
    </motion.div>
  )
}

export default Avatar
