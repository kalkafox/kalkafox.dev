// @ts-nocheck

import { EarsPhysics } from '@/lib/earphysics'
import {
  boundingClientRectAtom,
  docRefAtom,
  nerdStatsAtom,
  renderReadyAtom,
} from '@/util/atom'
import { animated } from '@react-spring/three'
import { useSpring } from '@react-spring/web'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { Group, Vector3 } from 'three'

export function KalkaProtogen(props) {
  const group = useRef<Group>(null)
  const { nodes, materials, animations } = useGLTF('/kalkaprotogen.gltf')
  const { actions } = useAnimations(animations, group)

  const [firstFrame, setFirstFrame] = useState(false)
  const [nerdStats, setNerdStats] = useAtom(nerdStatsAtom)
  const [_renderReady, setRenderReady] = useAtom(renderReadyAtom)

  const ref = useAtomValue(boundingClientRectAtom)

  const headRef = useRef<Group>(null)
  const leftEarRef = useRef<Group>(null)
  const rightEarRef = useRef<Group>(null)

  const mousePosition = useRef({ x: 0, y: 0 })
  const earPhysicsInstance = useRef<EarsPhysics | null>(null)

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
    state.camera.position.set(0, 1.8, -1)

    state.camera.lookAt(0, 1.5, 0)

    //state.camera.rotateOnAxis(new Vector3(0, 1.8, 0), 180)
  })

  useEffect(() => {
    if (leftEarRef.current && rightEarRef.current) {
      // Create simple wrappers that implement the setOffsetRot method.
      const leftEar: {
        setOffsetRot?: (
          rot?: Partial<{ x: number; y: number; z: number }>,
        ) => void
      } = {
        setOffsetRot: (rot) => {
          if (rot && leftEarRef.current) {
            // Update left ear rotation. Adjust the axis as needed.
            leftEarRef.current.rotation.set(rot.x, rot.y, rot.z)
          }
        },
      }
      const rightEar: {
        setOffsetRot?: (
          rot?: Partial<{ x: number; y: number; w: number }>,
        ) => void
      } = {
        setOffsetRot: (rot) => {
          if (rot && rightEarRef.current) {
            // Here we assume 'w' is used to drive the z rotation. Adjust if needed.
            rightEarRef.current.rotation.set(rot.x, rot.y, rot.w)
          }
        },
      }
      // Instantiate EarsPhysics which auto-registers itself for updates.
      if (
        !earPhysicsInstance.current &&
        leftEarRef.current &&
        rightEarRef.current
      ) {
        // Create and store the instance only once
        earPhysicsInstance.current = new EarsPhysics(leftEar, rightEar)
      }
    }
  }, [leftEarRef.current, rightEarRef.current])

  useFrame((_rootState, delta) => {
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

    console.log('ya')

    const { x, y } = mousePosition.current

    console.log(x)

    // Calculate the canvas position relative to the document

    const canvasRect = ref
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
      const bodyRotationY = clampedAngleY * 0.4
      const bodyTiltX = -clampedAngleX * 0.15 // Slight vertical tilt
      fullSpring[1].start({
        rotation: [bodyTiltX, bodyRotationY, 0],
      })
    }

    const player = {
      getRot: () => new Vector3(clampedAngleX, clampedAngleY, 0),
      getVelocity: () => new Vector3(0, 0, 0), // Replace with actual velocity if available
      getPose: () => 'STANDING', // or 'CROUCHING' based on your state
    }

    // Update all registered ears
    EarsPhysics.tick(player)
    EarsPhysics.render(delta)
  })

  return (
    <animated.group
      rotation={fullSpring[0].rotation}
      ref={group}
      {...props}
      dispose={null}
    >
      <group name="blockbench_export">
        <group>
          <animated.group
            // @ts-expect-error
            rotation={headSpring[0].rotation}
            ref={headRef}
            name="Head"
            position={[0, 1.5, 0]}
          >
            <group ref={leftEarRef} name="LeftEar" position={[0, 0.219, 0]}>
              <mesh
                name="Ear"
                castShadow
                receiveShadow
                // @ts-expect-error
                geometry={nodes.Ear.geometry}
                // @ts-expect-error
                material={nodes.Ear.material}
                rotation={[-0.401, -0.201, -0.085]}
              />
              <mesh
                name="Ear_1"
                castShadow
                receiveShadow
                // @ts-expect-error
                geometry={nodes.Ear_1.geometry}
                // @ts-expect-error
                material={nodes.Ear_1.material}
                rotation={[-0.401, -0.201, -0.085]}
              />
            </group>
            <group ref={rightEarRef} name="RightEar" position={[0, 0.219, 0]}>
              <mesh
                name="Ear_2"
                castShadow
                receiveShadow
                // @ts-expect-error
                geometry={nodes.Ear_2.geometry}
                // @ts-expect-error
                material={nodes.Ear_2.material}
                rotation={[-0.401, 0.201, 0.085]}
              />
              <mesh
                name="Ear_3"
                castShadow
                receiveShadow
                // @ts-expect-error
                geometry={nodes.Ear_3.geometry}
                // @ts-expect-error
                material={nodes.Ear_3.material}
                rotation={[-0.401, 0.201, 0.085]}
              />
            </group>
            <group
              name="VisorTop"
              position={[0, 0.063, -0.375]}
              rotation={[-0.305, 0, 0]}
            >
              <mesh
                name="Visor"
                castShadow
                receiveShadow
                // @ts-expect-error
                geometry={nodes.Visor.geometry}
                // @ts-expect-error
                material={nodes.Visor.material}
                position={[0, -1.563, 0.375]}
              />
              <mesh
                name="Visor_1"
                castShadow
                receiveShadow
                // @ts-expect-error
                geometry={nodes.Visor_1.geometry}
                // @ts-expect-error
                material={nodes.Visor_1.material}
                position={[-0.125, 0, 0]}
                rotation={[0, -0.218, 0]}
              />
              <mesh
                name="Visor_2"
                castShadow
                receiveShadow
                // @ts-expect-error
                geometry={nodes.Visor_2.geometry}
                // @ts-expect-error
                material={nodes.Visor_2.material}
                position={[0.125, 0, 0]}
                rotation={[0, 0.218, 0]}
              />
            </group>
            <group name="VisorBottom" position={[0, 0.063, -0.375]}>
              <mesh
                name="Visor_3"
                castShadow
                receiveShadow
                geometry={nodes.Visor_3.geometry}
                material={nodes.Visor_3.material}
                position={[-0.125, 0, 0]}
                rotation={[0, -0.218, 0]}
              />
              <mesh
                name="Visor_4"
                castShadow
                receiveShadow
                geometry={nodes.Visor_4.geometry}
                material={nodes.Visor_4.material}
                position={[0.125, 0, 0]}
                rotation={[0, 0.218, 0]}
              />
              <mesh
                name="Visor_5"
                castShadow
                receiveShadow
                geometry={nodes.Visor_5.geometry}
                material={nodes.Visor_5.material}
                position={[0, -1.563, 0.375]}
              />
            </group>
            <mesh
              name="Neck"
              castShadow
              receiveShadow
              geometry={nodes.Neck.geometry}
              material={nodes.Neck.material}
              position={[0, -1.5, 0]}
            />
            <mesh
              name="Head_1"
              castShadow
              receiveShadow
              geometry={nodes.Head_1.geometry}
              material={nodes.Head_1.material}
              position={[0, -1.5, 0]}
            />
            <mesh
              name="Screw"
              castShadow
              receiveShadow
              geometry={nodes.Screw.geometry}
              material={nodes.Screw.material}
              position={[-0.219, 0.156, 0.031]}
              rotation={[-Math.PI / 4, 0, 0]}
            />
            <mesh
              name="Screw_1"
              castShadow
              receiveShadow
              geometry={nodes.Screw_1.geometry}
              material={nodes.Screw_1.material}
              position={[-0.219, 0.156, 0.031]}
              rotation={[-Math.PI / 4, 0, 0]}
            />
            <mesh
              name="Separator"
              castShadow
              receiveShadow
              geometry={nodes.Separator.geometry}
              material={nodes.Separator.material}
              position={[0, 0.219, 0]}
              rotation={[-0.262, 0, 0]}
            />
            <mesh
              name="Fur"
              castShadow
              receiveShadow
              geometry={nodes.Fur.geometry}
              material={nodes.Fur.material}
              rotation={[-0.175, 0, 0]}
            />
            <mesh
              name="Fur_1"
              castShadow
              receiveShadow
              geometry={nodes.Fur_1.geometry}
              material={nodes.Fur_1.material}
              rotation={[0.087, 0, 0]}
            />
            <mesh
              name="Fur_2"
              castShadow
              receiveShadow
              geometry={nodes.Fur_2.geometry}
              material={nodes.Fur_2.material}
              rotation={[0.611, 0, 0]}
            />
            <mesh
              name="Fur_3"
              castShadow
              receiveShadow
              geometry={nodes.Fur_3.geometry}
              material={nodes.Fur_3.material}
              rotation={[1.004, 0, 0]}
            />
          </animated.group>
          <group name="Body" position={[0, 1.5, 0]}>
            <mesh
              name="Hips"
              castShadow
              receiveShadow
              geometry={nodes.Hips.geometry}
              material={nodes.Hips.material}
              position={[0, -1.5, 0]}
            />
            <mesh
              name="Waist"
              castShadow
              receiveShadow
              geometry={nodes.Waist.geometry}
              material={nodes.Waist.material}
              position={[0, -1.5, 0]}
            />
            <mesh
              name="Chest"
              castShadow
              receiveShadow
              geometry={nodes.Chest.geometry}
              material={nodes.Chest.material}
              position={[0, -1.5, 0]}
            />
            <group name="ChestPlate">
              <mesh
                name="Panel"
                castShadow
                receiveShadow
                geometry={nodes.Panel.geometry}
                material={nodes.Panel.material}
                position={[0, -1.5, 0]}
              />
              <group name="Front" position={[0, -1.5, 0]}>
                <mesh
                  name="cube"
                  castShadow
                  receiveShadow
                  geometry={nodes.cube.geometry}
                  material={nodes.cube.material}
                />
                <mesh
                  name="cube_1"
                  castShadow
                  receiveShadow
                  geometry={nodes.cube_1.geometry}
                  material={nodes.cube_1.material}
                />
                <mesh
                  name="cube_2"
                  castShadow
                  receiveShadow
                  geometry={nodes.cube_2.geometry}
                  material={nodes.cube_2.material}
                />
                <mesh
                  name="cube_3"
                  castShadow
                  receiveShadow
                  geometry={nodes.cube_3.geometry}
                  material={nodes.cube_3.material}
                />
                <mesh
                  name="cube_4"
                  castShadow
                  receiveShadow
                  geometry={nodes.cube_4.geometry}
                  material={nodes.cube_4.material}
                />
                <mesh
                  name="cube_5"
                  castShadow
                  receiveShadow
                  geometry={nodes.cube_5.geometry}
                  material={nodes.cube_5.material}
                  position={[0.313, 0, 0]}
                />
              </group>
            </group>
            <group
              name="Tail"
              position={[0, -0.563, 0]}
              rotation={[Math.PI / 3, 0, 0]}
            >
              <mesh
                name="Tail_1"
                castShadow
                receiveShadow
                geometry={nodes.Tail_1.geometry}
                material={nodes.Tail_1.material}
                position={[0, -0.938, 0]}
              />
              <group name="Tail1" position={[0, 0, -0.031]}>
                <mesh
                  name="Tail_2"
                  castShadow
                  receiveShadow
                  geometry={nodes.Tail_2.geometry}
                  material={nodes.Tail_2.material}
                  position={[0, -0.938, 0.031]}
                />
                <group
                  name="Tail2"
                  position={[0, 0, 0.375]}
                  rotation={[-0.262, 0, 0]}
                >
                  <mesh
                    name="Tail_3"
                    castShadow
                    receiveShadow
                    geometry={nodes.Tail_3.geometry}
                    material={nodes.Tail_3.material}
                    position={[0, -0.938, -0.344]}
                  />
                  <group
                    name="Tail3"
                    position={[0.031, 0.031, 0.281]}
                    rotation={[-0.131, 0, 0]}
                  >
                    <mesh
                      name="Tail_4"
                      castShadow
                      receiveShadow
                      geometry={nodes.Tail_4.geometry}
                      material={nodes.Tail_4.material}
                      rotation={[-0.131, 0, 0]}
                    />
                    <group
                      name="Tail4"
                      position={[0.031, 0.031, 0.219]}
                      rotation={[-0.087, 0, 0]}
                    >
                      <mesh
                        name="Tail_5"
                        castShadow
                        receiveShadow
                        geometry={nodes.Tail_5.geometry}
                        material={nodes.Tail_5.material}
                        rotation={[-0.48, 0, 0]}
                      />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
          <group name="RightArm" position={[0.313, 1.375, 0]}>
            <mesh
              name="Right_Arm"
              castShadow
              receiveShadow
              geometry={nodes.Right_Arm.geometry}
              material={nodes.Right_Arm.material}
              position={[-0.313, -1.375, 0]}
            />
            <mesh
              name="Shield"
              castShadow
              receiveShadow
              geometry={nodes.Shield.geometry}
              material={nodes.Shield.material}
              position={[-0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_1"
              castShadow
              receiveShadow
              geometry={nodes.Shield_1.geometry}
              material={nodes.Shield_1.material}
              position={[-0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_2"
              castShadow
              receiveShadow
              geometry={nodes.Shield_2.geometry}
              material={nodes.Shield_2.material}
              position={[-0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_3"
              castShadow
              receiveShadow
              geometry={nodes.Shield_3.geometry}
              material={nodes.Shield_3.material}
              position={[-0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_Panel"
              castShadow
              receiveShadow
              geometry={nodes.Shield_Panel.geometry}
              material={nodes.Shield_Panel.material}
              position={[-0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_4"
              castShadow
              receiveShadow
              geometry={nodes.Shield_4.geometry}
              material={nodes.Shield_4.material}
              position={[-0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_5"
              castShadow
              receiveShadow
              geometry={nodes.Shield_5.geometry}
              material={nodes.Shield_5.material}
              position={[-0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_Panel_1"
              castShadow
              receiveShadow
              geometry={nodes.Shield_Panel_1.geometry}
              material={nodes.Shield_Panel_1.material}
              position={[-0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_6"
              castShadow
              receiveShadow
              geometry={nodes.Shield_6.geometry}
              material={nodes.Shield_6.material}
              position={[-0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_Panel_2"
              castShadow
              receiveShadow
              geometry={nodes.Shield_Panel_2.geometry}
              material={nodes.Shield_Panel_2.material}
              position={[-0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_7"
              castShadow
              receiveShadow
              geometry={nodes.Shield_7.geometry}
              material={nodes.Shield_7.material}
              position={[-0.313, -1.375, 0]}
            />
          </group>
          <group name="LeftArm" position={[-0.313, 1.375, 0]}>
            <mesh
              name="Left_Arm"
              castShadow
              receiveShadow
              geometry={nodes.Left_Arm.geometry}
              material={nodes.Left_Arm.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_8"
              castShadow
              receiveShadow
              geometry={nodes.Shield_8.geometry}
              material={nodes.Shield_8.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_9"
              castShadow
              receiveShadow
              geometry={nodes.Shield_9.geometry}
              material={nodes.Shield_9.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_10"
              castShadow
              receiveShadow
              geometry={nodes.Shield_10.geometry}
              material={nodes.Shield_10.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_11"
              castShadow
              receiveShadow
              geometry={nodes.Shield_11.geometry}
              material={nodes.Shield_11.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_Panel_3"
              castShadow
              receiveShadow
              geometry={nodes.Shield_Panel_3.geometry}
              material={nodes.Shield_Panel_3.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_12"
              castShadow
              receiveShadow
              geometry={nodes.Shield_12.geometry}
              material={nodes.Shield_12.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_13"
              castShadow
              receiveShadow
              geometry={nodes.Shield_13.geometry}
              material={nodes.Shield_13.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_14"
              castShadow
              receiveShadow
              geometry={nodes.Shield_14.geometry}
              material={nodes.Shield_14.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_Panel_4"
              castShadow
              receiveShadow
              geometry={nodes.Shield_Panel_4.geometry}
              material={nodes.Shield_Panel_4.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_15"
              castShadow
              receiveShadow
              geometry={nodes.Shield_15.geometry}
              material={nodes.Shield_15.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_16"
              castShadow
              receiveShadow
              geometry={nodes.Shield_16.geometry}
              material={nodes.Shield_16.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_17"
              castShadow
              receiveShadow
              geometry={nodes.Shield_17.geometry}
              material={nodes.Shield_17.material}
              position={[0.313, -1.375, 0]}
            />
            <mesh
              name="Shield_Panel_5"
              castShadow
              receiveShadow
              geometry={nodes.Shield_Panel_5.geometry}
              material={nodes.Shield_Panel_5.material}
              position={[0.313, -1.375, 0]}
            />
          </group>
          <group name="RightLeg" position={[0.119, 0.75, 0]}>
            <mesh
              name="Right_Leg"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg.geometry}
              material={nodes.Right_Leg.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0.42, -0.08, 0.036]}
            />
            <mesh
              name="Right_Leg_2"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg_2.geometry}
              material={nodes.Right_Leg_2.material}
              position={[-0.119, -0.75, 0]}
              rotation={[-0.962, -0.05, -0.072]}
            />
            <mesh
              name="Right_Leg_3"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg_3.geometry}
              material={nodes.Right_Leg_3.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0.131, -0.087, 0.011]}
            />
            <mesh
              name="Right_Foot"
              castShadow
              receiveShadow
              geometry={nodes.Right_Foot.geometry}
              material={nodes.Right_Foot.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0, -0.087, 0]}
            />
            <mesh
              name="Right_Leg_Shield_Bracket_Plate"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg_Shield_Bracket_Plate.geometry}
              material={nodes.Right_Leg_Shield_Bracket_Plate.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0.42, -0.08, 0.036]}
            />
            <mesh
              name="Right_Leg_Shield_Bracket_Plate_2"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg_Shield_Bracket_Plate_2.geometry}
              material={nodes.Right_Leg_Shield_Bracket_Plate_2.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0.42, -0.08, 0.036]}
            />
            <mesh
              name="Right_Leg_Shield_Bracket_Plate_3"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg_Shield_Bracket_Plate_3.geometry}
              material={nodes.Right_Leg_Shield_Bracket_Plate_3.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0.42, -0.08, 0.036]}
            />
            <mesh
              name="Right_Leg_Shield_Bracket_Plate_4"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg_Shield_Bracket_Plate_4.geometry}
              material={nodes.Right_Leg_Shield_Bracket_Plate_4.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0.42, -0.08, 0.036]}
            />
            <mesh
              name="Right_Leg_Shield"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg_Shield.geometry}
              material={nodes.Right_Leg_Shield.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0.42, -0.08, 0.036]}
            />
            <mesh
              name="Right_Leg_Shield_Bracket"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg_Shield_Bracket.geometry}
              material={nodes.Right_Leg_Shield_Bracket.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0.42, -0.08, 0.036]}
            />
            <mesh
              name="Right_Leg_Shield_Bracket_2"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg_Shield_Bracket_2.geometry}
              material={nodes.Right_Leg_Shield_Bracket_2.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0.42, -0.08, 0.036]}
            />
            <mesh
              name="Right_Leg_Shield_Bracket_3"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg_Shield_Bracket_3.geometry}
              material={nodes.Right_Leg_Shield_Bracket_3.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0.42, -0.08, 0.036]}
            />
            <mesh
              name="Right_Leg_Shield_Bracket_4"
              castShadow
              receiveShadow
              geometry={nodes.Right_Leg_Shield_Bracket_4.geometry}
              material={nodes.Right_Leg_Shield_Bracket_4.material}
              position={[-0.119, -0.75, 0]}
              rotation={[0.42, -0.08, 0.036]}
            />
          </group>
          <group name="LeftLeg" position={[-0.119, 0.75, 0]}>
            <mesh
              name="Left_Leg"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg.geometry}
              material={nodes.Left_Leg.material}
              position={[0.119, -0.75, 0]}
              rotation={[0.42, 0.08, -0.036]}
            />
            <mesh
              name="Left_Leg_2"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg_2.geometry}
              material={nodes.Left_Leg_2.material}
              position={[0.119, -0.75, 0]}
              rotation={[-0.962, 0.05, 0.072]}
            />
            <mesh
              name="Left_Leg_3"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg_3.geometry}
              material={nodes.Left_Leg_3.material}
              position={[0.119, -0.75, 0]}
              rotation={[0.131, 0.087, -0.011]}
            />
            <mesh
              name="Left_Foot"
              castShadow
              receiveShadow
              geometry={nodes.Left_Foot.geometry}
              material={nodes.Left_Foot.material}
              position={[0.119, -0.75, 0]}
              rotation={[0, 0.087, 0]}
            />
            <mesh
              name="Left_Leg_Shield"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg_Shield.geometry}
              material={nodes.Left_Leg_Shield.material}
              position={[0.119, -0.75, 0]}
              rotation={[0.42, 0.08, -0.036]}
            />
            <mesh
              name="Left_Leg_Shield_Bracket"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg_Shield_Bracket.geometry}
              material={nodes.Left_Leg_Shield_Bracket.material}
              position={[0.119, -0.75, 0]}
              rotation={[0.42, 0.08, -0.036]}
            />
            <mesh
              name="Left_Leg_Shield_Bracket_2"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg_Shield_Bracket_2.geometry}
              material={nodes.Left_Leg_Shield_Bracket_2.material}
              position={[0.119, -0.75, 0]}
              rotation={[0.42, 0.08, -0.036]}
            />
            <mesh
              name="Left_Leg_Shield_Bracket_3"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg_Shield_Bracket_3.geometry}
              material={nodes.Left_Leg_Shield_Bracket_3.material}
              position={[0.119, -0.75, 0]}
              rotation={[0.42, 0.08, -0.036]}
            />
            <mesh
              name="Left_Leg_Shield_Bracket_4"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg_Shield_Bracket_4.geometry}
              material={nodes.Left_Leg_Shield_Bracket_4.material}
              position={[0.119, -0.75, 0]}
              rotation={[0.42, 0.08, -0.036]}
            />
            <mesh
              name="Left_Leg_Shield_Bracket_Plate"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg_Shield_Bracket_Plate.geometry}
              material={nodes.Left_Leg_Shield_Bracket_Plate.material}
              position={[0.119, -0.75, 0]}
              rotation={[0.42, 0.08, -0.036]}
            />
            <mesh
              name="Left_Leg_Shield_Bracket_Plate_2"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg_Shield_Bracket_Plate_2.geometry}
              material={nodes.Left_Leg_Shield_Bracket_Plate_2.material}
              position={[0.119, -0.75, 0]}
              rotation={[0.42, 0.08, -0.036]}
            />
            <mesh
              name="Left_Leg_Shield_Bracket_Plate_3"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg_Shield_Bracket_Plate_3.geometry}
              material={nodes.Left_Leg_Shield_Bracket_Plate_3.material}
              position={[0.119, -0.75, 0]}
              rotation={[0.42, 0.08, -0.036]}
            />
            <mesh
              name="Left_Leg_Shield_Bracket_Plate_4"
              castShadow
              receiveShadow
              geometry={nodes.Left_Leg_Shield_Bracket_Plate_4.geometry}
              material={nodes.Left_Leg_Shield_Bracket_Plate_4.material}
              position={[0.119, -0.75, 0]}
              rotation={[0.42, 0.08, -0.036]}
            />
          </group>
        </group>
      </group>
    </animated.group>
  )
}

useGLTF.preload('/kalkaprotogen.gltf')
