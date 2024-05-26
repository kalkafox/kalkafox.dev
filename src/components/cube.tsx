import { useLayoutEffect, useRef, useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'

import type { Mesh } from 'three'

import { animated as a, useSpring } from '@react-spring/three'
import { useAtom } from 'jotai'
import { nerdStatsAtom } from '@/util/atom'

function WireframeBox(props: any) {
  const mesh = useRef<Mesh>(null)

  const [active, setActive] = useState(false)

  const [nerdStats, setNerdStats] = useAtom(nerdStatsAtom)

  const [firstFrame, setFirstFrame] = useState(false)

  useFrame((_rootState, delta) => {
    if (mesh.current) {
      if (!firstFrame) {
        setNerdStats((e) => ({
          ...e,
          timeTo3DRender: Date.now() - nerdStats.initialTime,
        }))
        setFirstFrame(true)
      }

      mesh.current.rotation.y += 0.5 * delta
      mesh.current.rotation.x = Math.cos(mesh.current.rotation.y) * 0.5
    }
  })

  const { scale } = useSpring({
    scale: 3,
    config: { tension: 500 },
  })

  useLayoutEffect(() => {
    setActive(true)
  }, [])

  if (!active) return

  return (
    <a.mesh {...props} ref={mesh} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={props.color} wireframe />
    </a.mesh>
  )
}

export default function WireframeBoxComponent() {
  const cameraControlRef = useRef<CameraControls | null>(null)
  return (
    <>
      <Canvas>
        <CameraControls ref={cameraControlRef} />
        <WireframeBox position={[0, 0, 0]} scale={[3, 3, 3]} color={'#aaa'} />
      </Canvas>
    </>
  )
}
