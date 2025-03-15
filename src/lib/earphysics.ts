import * as THREE from 'three'

/**
 * A simple interface for parts of the model that support an offset rotation.
 * For example, left/right ears must implement a setOffsetRot method.
 */
export interface ModelPart {
  setOffsetRot?: (
    rotation?: Partial<{ x: number; y: number; z: number; w: number }>,
  ) => void
}

/**
 * Configuration options for ear physics.
 */
export interface EarsPhysicsConfig {
  velocityStrength: number // can be extended to support THREE.Vector3 if needed
  headRotStrength: number
  bounce: number
  stiff: number
  extraAngle: number
  useExtraAngle: boolean[]
  addAngle: number[]
  earsFlick: boolean
  flickChance: number
  flickDelay: number
  flickStrength: number
  rotMin: { x: number; y: number; z: number }
  rotMax: { x: number; y: number; z: number }
  headRotMin: number
  headRotMax: number
}

/**
 * A minimal 4D vector class for handling rotation (x, y, z, w).
 */
class Vec4 {
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number,
  ) {}

  clone(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w)
  }

  add(v: Vec4): Vec4 {
    return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w)
  }

  subtract(v: Vec4): Vec4 {
    return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w)
  }

  multiplyScalar(s: number): Vec4 {
    return new Vec4(this.x * s, this.y * s, this.z * s, this.w * s)
  }

  lerp(target: Vec4, t: number): Vec4 {
    return new Vec4(
      this.x + (target.x - this.x) * t,
      this.y + (target.y - this.y) * t,
      this.z + (target.z - this.z) * t,
      this.w + (target.w - this.w) * t,
    )
  }
}

// Helper clamp function
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * EarsPhysics mimics the behavior of the Lua script:
 * - It tracks state such as rotation (a 4D vector), velocity, and a flick delay.
 * - The static methods tick() and render() update all active physics instances.
 */
export class EarsPhysics {
  // A static set to hold all ears instances that are “updating”
  private static updatingEars = new Set<EarsPhysics>()
  // Store previous player rotation for calculating rotational velocity
  private static oldPlayerRot: THREE.Vector3 | null = null

  public config: EarsPhysicsConfig
  public leftEar: ModelPart
  public rightEar: ModelPart
  public rot: Vec4
  public oldRot: Vec4
  public vel: Vec4
  public flickTime: number

  // Flick direction indicator: 'z' for left ear, 'w' for right ear
  private flickDir: 'z' | 'w' | null = null

  constructor(leftEar: ModelPart, rightEar: ModelPart) {
    // Default configuration (adjust as needed)
    this.config = {
      velocityStrength: 0.05,
      headRotStrength: 0.4,
      bounce: 0.2,
      stiff: 0.3,
      extraAngle: 15,
      useExtraAngle: [],
      addAngle: [],
      earsFlick: true,
      flickChance: 400,
      flickDelay: 40,
      flickStrength: 2,
      rotMin: { x: -12, y: -8, z: -4 },
      rotMax: { x: 12, y: 8, z: 6 },
      headRotMin: -90,
      headRotMax: 90,
    }

    this.leftEar = leftEar
    this.rightEar = rightEar
    this.rot = new Vec4(0, 0, 0, 0)
    this.oldRot = this.rot.clone()
    this.vel = new Vec4(0, 0, 0, 0)
    this.flickTime = 0

    // Add this instance to the list of updating ears
    EarsPhysics.updatingEars.add(this)
  }

  /**
   * Merge new configuration values into the current config.
   */
  setConfig(tbl: Partial<EarsPhysicsConfig>): this {
    Object.assign(this.config, tbl)
    return this
  }

  /**
   * Toggle whether this instance should update.
   */
  setUpdate(x: boolean): this {
    if (x) {
      EarsPhysics.updatingEars.add(this)
    } else {
      EarsPhysics.updatingEars.delete(this)
    }
    return this
  }

  /**
   * Remove this instance from physics updates.
   * If keepRot is false, resets the ear rotations.
   */
  remove(keepRot?: boolean): void {
    if (!keepRot) {
      if (this.leftEar.setOffsetRot) this.leftEar.setOffsetRot()
      if (this.rightEar.setOffsetRot) this.rightEar.setOffsetRot()
    }
    EarsPhysics.updatingEars.delete(this)
  }

  /**
   * Internal update for this ear physics instance.
   * @param playerVel - The player's velocity as a THREE.Vector3.
   * @param playerRotVel - The player's rotational velocity.
   * @param isCrouching - Whether the player is crouching.
   * @param playerRot - The player's current rotation.
   */
  private tick(
    playerVel: THREE.Vector3,
    playerRotVel: THREE.Vector3,
    isCrouching: boolean,
    playerRot: THREE.Vector3,
  ) {
    // Save the previous rotation
    this.oldRot = this.rot.clone()

    // Determine target rotation (Z and W components) based on crouching or extra angle usage
    let targetRotZW = 0
    if (isCrouching) {
      targetRotZW = this.config.extraAngle
    } else {
      if (this.config.useExtraAngle.some((v) => v)) {
        targetRotZW = this.config.extraAngle
      }
    }
    // Add any extra angles
    for (const angle of this.config.addAngle) {
      targetRotZW += angle
    }

    // Build the target rotation vector.
    // X is based on the head rotation strength (clamped),
    // Y is 0,
    // Z and W are set to extra angle and its negative.
    const targetRot = new Vec4(
      clamp(
        this.config.headRotStrength * -playerRot.x,
        this.config.headRotMin,
        this.config.headRotMax,
      ),
      0,
      targetRotZW,
      -targetRotZW,
    )

    // Scale the player's velocity and rotation velocity
    const scaledPlayerVel = playerVel
      .clone()
      .multiplyScalar(this.config.velocityStrength * 60)
    const scaledPlayerRotVel = playerRotVel
      .clone()
      .multiplyScalar(this.config.velocityStrength)

    // Calculate a final velocity vector using clamping on each axis.
    const finalVelX = clamp(
      scaledPlayerVel.z + scaledPlayerRotVel.x,
      this.config.rotMin.x,
      this.config.rotMax.x,
    )
    const finalVelY = clamp(
      scaledPlayerVel.x,
      this.config.rotMin.y,
      this.config.rotMax.y,
    )
    const finalVelZ = clamp(
      scaledPlayerVel.y * 0.25,
      this.config.rotMin.z,
      this.config.rotMax.z,
    )

    // Update velocity: damp the current velocity then add a portion of the difference between target and current rotations.
    const velDamped = this.vel.multiplyScalar(1 - this.config.stiff)
    const rotDiff = targetRot
      .subtract(this.rot)
      .multiplyScalar(this.config.bounce)
    this.vel = velDamped.add(rotDiff)

    // === Flick Effect (One-Shot Impulse with Clamping) ===
    if (
      this.flickTime === 0 &&
      this.config.earsFlick &&
      Math.random() < 1 / Math.max(this.config.flickChance, 1)
    ) {
      // Start a flick event by setting flickTime and choosing direction.
      this.flickTime = this.config.flickDelay
      this.flickDir = Math.random() > 0.5 ? 'z' : 'w'
      // Apply a one-shot impulse scaled down (adjust 0.2 as needed)
      const impulse = this.config.flickStrength * 0.2
      if (this.flickDir === 'z') {
        this.vel.z += impulse
      } else if (this.flickDir === 'w') {
        this.vel.w -= impulse
      }
    } else if (this.flickTime > 0) {
      // Simply decrement flickTime until the flick event is over.
      this.flickTime = Math.max(this.flickTime - 1, 0)
      if (this.flickTime === 0) {
        this.flickDir = null
      }
    }
    // Clamp flick-induced velocity components to avoid excessive values.
    this.vel.z = clamp(
      this.vel.z,
      -this.config.flickStrength,
      this.config.flickStrength,
    )
    this.vel.w = clamp(
      this.vel.w,
      -this.config.flickStrength,
      this.config.flickStrength,
    )
    // === End Flick Effect ===

    // Update the rotation by adding the velocity.
    this.rot = this.rot.add(this.vel)
    // Adjust specific components with the final velocity
    this.rot.x += finalVelX
    this.rot.z = this.rot.z - finalVelY + finalVelZ
    this.rot.w = this.rot.w - finalVelY - finalVelZ
  }

  /**
   * Internal render update for this instance.
   * Interpolates between old and current rotation based on delta and applies it to the ears.
   * @param delta - A value between 0 and 1 for interpolation.
   */
  private render(delta: number) {
    const interpolated = this.oldRot.lerp(this.rot, delta)
    // Apply to left ear using x, y, z components
    if (this.leftEar.setOffsetRot)
      this.leftEar.setOffsetRot({
        x: interpolated.x,
        y: interpolated.y,
        z: interpolated.z,
      })
    // Apply to right ear using x, y, and w components
    if (this.rightEar.setOffsetRot)
      this.rightEar.setOffsetRot({
        x: interpolated.x,
        y: interpolated.y,
        w: interpolated.w,
      })
  }

  /**
   * Update (tick) all active ears physics instances.
   * Pass in a player object that exposes getRot(), getVelocity(), and getPose().
   */
  static tick(player: {
    getRot: () => THREE.Vector3
    getVelocity: () => THREE.Vector3
    getPose: () => string
  }) {
    if (EarsPhysics.updatingEars.size === 0) return

    const playerRot = player.getRot()
    if (!EarsPhysics.oldPlayerRot) {
      EarsPhysics.oldPlayerRot = playerRot.clone()
    }
    // Calculate the player's rotational velocity
    const playerRotVel = playerRot
      .clone()
      .sub(EarsPhysics.oldPlayerRot)
      .multiplyScalar(0.75)
    EarsPhysics.oldPlayerRot.copy(playerRot)

    // Adjust the player's velocity:
    let playerVel = player.getVelocity()
    // Rotate around the Y axis by playerRot.y
    playerVel = playerVel
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), playerRot.y)
    // Then rotate around the X axis by -playerRot.x
    playerVel = playerVel
      .clone()
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), -playerRot.x)

    const isCrouching = player.getPose() === 'CROUCHING'

    // Tick each active EarsPhysics instance
    EarsPhysics.updatingEars.forEach((ear) => {
      ear.tick(playerVel, playerRotVel, isCrouching, playerRot)
    })
  }

  /**
   * Render update for all active ears physics instances.
   * Should be called each render frame with the interpolation delta.
   * @param delta - Interpolation factor (0 to 1)
   */
  static render(delta: number) {
    EarsPhysics.updatingEars.forEach((ear) => {
      ear.render(delta)
    })
  }
}
