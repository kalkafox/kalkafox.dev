import { docRefAtom, nerdStatsAtom, renderReadyAtom } from '@/util/atom'
import { animated, useSpring } from '@react-spring/three'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { Group } from 'three'

export function KalkaMCModel() {
  const { nodes } = useGLTF('/kalka.gltf')

  const [_renderReady, setRenderReady] = useAtom(renderReadyAtom)

  const [nerdStats, setNerdStats] = useAtom(nerdStatsAtom)

  const [firstFrame, setFirstFrame] = useState(false)

  const ref = useAtomValue(docRefAtom)

  const headRef = useRef<Group>(null)
  const fullRef = useRef<Group>(null)

  const mousePosition = useRef({ x: 0, y: 0 })

  const headSpring = useSpring(() => ({
    rotation: [0, 0, 0],
  }))

  const fullSpring = useSpring(() => ({
    rotation: [0, 3.1, 0],
  }))

  // Track mouse position on the entire page
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = event.clientX
      mousePosition.current.y = event.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useThree((state) => {
    state.camera.position.set(0, 0, 1)

    //state.camera.rotateOnAxis(new Vector3(0, 1.8, 0), 180)
  })

  useFrame((_rootState, _delta) => {
    if (!firstFrame) {
      setNerdStats((e) => ({
        ...e,
        timeTo3DRender: Date.now() - nerdStats.initialTime,
      }))

      setRenderReady(true)
      setFirstFrame(true)
    }

    if (!headRef.current) return

    if (!ref) return

    if (!ref.current) return

    const { x, y } = mousePosition.current

    // Calculate the canvas position relative to the document

    const canvasRect = ref.current.getBoundingClientRect()
    const canvasLeft = canvasRect.left
    const canvasTop = canvasRect.top

    // Adjust mouse position relative to the canvas
    const relativeX = x - canvasLeft
    const relativeY = y - canvasTop

    // Calculate the center of the canvas
    const centerX = canvasRect.width / 2
    const centerY = canvasRect.height / 2

    // Calculate normalized mouse position
    const normalizedX = (relativeX - centerX) / centerX
    const normalizedY = (relativeY - centerY) / centerY

    // Calculate angles for rotation
    const angleY = Math.atan2(normalizedX, 1) // Horizontal rotation
    const angleX = -Math.atan2(normalizedY, 1) // Vertical rotation (invert Y axis)

    // Define rotation bounds (for example, between -0.4 and 0.4 radians for both axes)
    const maxRotation = 0.5
    const clampedAngleX = Math.max(-maxRotation, Math.min(maxRotation, angleX))
    const clampedAngleY = Math.max(-maxRotation, Math.min(maxRotation, angleY))

    // Apply the bounded rotation to the head
    //headRef.current.rotation.set(clampedAngleX, clampedAngleY, 0)
    headSpring[1].start({
      rotation: [clampedAngleX, clampedAngleY, 0],
    })

    const body = headRef.current.parent

    if (body) {
      const bodyRotationY = 3.1 + clampedAngleY * 0.4
      const bodyTiltX = -clampedAngleX * 0.2 // Slight vertical tilt
      fullSpring[1].start({
        rotation: [bodyTiltX, bodyRotationY, 0],
      })
    }
  })

  return (
    <animated.group
      dispose={null}
      // @ts-expect-error
      rotation={fullSpring[0].rotation}
      ref={fullRef}
    >
      <animated.group
        // @ts-expect-error
        rotation={headSpring[0].rotation}
        position={[0, 1.5, 0]}
        ref={headRef}
      >
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Head_1.geometry}
          // @ts-expect-error
          material={nodes.Head_1.material}
          position={[0, -1.5, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Hat_Layer.geometry}
          // @ts-expect-error
          material={nodes.Hat_Layer.material}
          position={[0, -1.5, 0]}
        />
      </animated.group>
      <group position={[0, 1.5, 0]}>
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Body_1.geometry}
          // @ts-expect-error
          material={nodes.Body_1.material}
          position={[0, -1.5, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Body_Layer.geometry}
          // @ts-expect-error
          material={nodes.Body_Layer.material}
          position={[0, -1.5, 0]}
        />
      </group>
      <group position={[0.313, 1.375, 0]}>
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Right_Arm.geometry}
          // @ts-expect-error
          material={nodes.Right_Arm.material}
          position={[-0.313, -1.375, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Right_Arm_Layer.geometry}
          // @ts-expect-error
          material={nodes.Right_Arm_Layer.material}
          position={[-0.313, -1.375, 0]}
        />
      </group>
      <group position={[-0.313, 1.375, 0]}>
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Left_Arm.geometry}
          // @ts-expect-error
          material={nodes.Left_Arm.material}
          position={[0.313, -1.375, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Left_Arm_Layer.geometry}
          // @ts-expect-error
          material={nodes.Left_Arm_Layer.material}
          position={[0.313, -1.375, 0]}
        />
      </group>
      <group position={[0.119, 0.75, 0]}>
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Right_Leg.geometry}
          // @ts-expect-error
          material={nodes.Right_Leg.material}
          position={[-0.119, -0.75, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Right_Leg_Layer.geometry}
          // @ts-expect-error
          material={nodes.Right_Leg_Layer.material}
          position={[-0.119, -0.75, 0]}
        />
      </group>
      <group position={[-0.119, 0.75, 0]}>
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Left_Leg.geometry}
          // @ts-expect-error
          material={nodes.Left_Leg.material}
          position={[0.119, -0.75, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          // @ts-expect-error
          geometry={nodes.Left_Leg_Layer.geometry}
          // @ts-expect-error
          material={nodes.Left_Leg_Layer.material}
          position={[0.119, -0.75, 0]}
        />
      </group>
    </animated.group>
  )
}

useGLTF.preload('/kalka.gltf')

console.log('Preloaded the GLTF model.')
