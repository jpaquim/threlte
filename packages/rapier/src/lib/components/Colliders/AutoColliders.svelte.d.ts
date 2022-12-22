import type { CoefficientCombineRule, Collider } from '@dimforge/rapier3d-compat'
import type { Position, TransformableObjectProperties, Rotation } from '@threlte/core'
import { SvelteComponentTyped } from 'svelte'
import type { AutoCollidersShapes } from '../../types/types'

// ------------------ BASE ------------------

type BaseProps = {
  shape?: AutoCollidersShapes
  position?: TransformableObjectProperties['position']
  rotation?: TransformableObjectProperties['rotation']
  scale?: TransformableObjectProperties['scale']
  lookAt?: TransformableObjectProperties['lookAt']
  restitution?: number
  restitutionCombineRule?: CoefficientCombineRule
  friction?: number
  frictionCombineRule?: CoefficientCombineRule
  sensor?: boolean
  colliders?: Collider[]
  contactForceEventThreshold?: number
}

// ------------------ MASS ------------------

type Density = {
  density: number

  mass?: never
  centerOfMass?: never
  principalAngularInertia?: never
  angularInertiaLocalFrame?: never
}
type Mass = {
  mass: number

  density?: never
  centerOfMass?: never
  principalAngularInertia?: never
  angularInertiaLocalFrame?: never
}
type MassProperties = {
  mass: number
  centerOfMass: Position
  principalAngularInertia: Position
  angularInertiaLocalFrame: Rotation

  density?: never
}

type NoMassProperties = {
  density?: never
  mass?: never
  centerOfMass?: never
  principalAngularInertia?: never
  angularInertiaLocalFrame?: never
}

export type MassDef = Density | Mass | MassProperties | NoMassProperties

type MassProps<TMassDef extends MassDef> = TMassDef extends Density
  ? Density
  : TMassDef extends MassProperties
  ? MassProperties
  : TMassDef extends Mass
  ? Mass
  : NoMassProperties

// ------------------ COLLIDER ------------------

export type AutoCollidersProps<TMassDef extends MassDef> = BaseProps & MassProps<TMassDef>

export default class AutoColliders<TMassDef extends MassDef> extends SvelteComponentTyped<
  AutoCollidersProps<TMassDef>
> {}
