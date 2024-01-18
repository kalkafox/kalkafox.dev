import { useLayoutEffect, useRef, useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'

import type { Mesh } from 'three'

import { animated as a, useSpring } from '@react-spring/three'

function WireframeBox(props: any) {
  const mesh = useRef<Mesh>(null)

  const [active, setActive] = useState(false)

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.5 * delta
      mesh.current.rotation.x = Math.cos(mesh.current.rotation.y) * 0.5
    }
  })

  const { scale } = useSpring({
    scale: active ? 3 : 1,
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
  return (
    <Canvas>
      <WireframeBox position={[0, 0, 0]} scale={[3, 3, 3]} color={'#aaa'} />
    </Canvas>
  )
}
