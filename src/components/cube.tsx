import { useEffect, useRef, useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'

import { animated as a, useSpring } from '@react-spring/three'

import { Mesh } from 'three'

function WireframeBox(props: any) {
  const mesh = useRef<Mesh>(null!)

  const [active, setActive] = useState(false)

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01
      mesh.current.rotation.x = Math.cos(mesh.current.rotation.y) * 0.5
    }
  })

  const { scale } = useSpring({ scale: active ? 3 : 1 })

  useEffect(() => {
    if (mesh.current) {
      setActive(true)
    }
  }, [])

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
