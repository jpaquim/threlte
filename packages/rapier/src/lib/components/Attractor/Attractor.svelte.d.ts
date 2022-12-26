import { SvelteComponentTyped } from 'svelte'
import {
  Props,
  type Events,
  type Slots,
  type LookAt,
  type Position,
  type Rotation,
  type Scale
} from '@threlte/core'
import type { Group } from 'three'

export type GravityType = 'static' | 'linear' | 'newtonian'

type AttractorProps = Props<Group> & {
  // TODO: fix these types, adapted from TransformableObjectProperties
  position?: Position
  scale?: Scale
  rotation?: Rotation
  lookAt?: LookAt

  /**
   * The radius for the Attractor's sphere of influence within which rigid-bodies will be affected.
   * Default: 10.0
   */
  range?: number
  /**
   * The strength factor applied to the impulse affecting rigid-bodies within range. For newtonian
   * calculations, strength is treated as m1 mass.
   * Default: 1.0
   */
  strength?: number
  /**
   * The method of calculating gravity on rigid bodies within range.
   * 'static' = the same force (strength) is applied on bodies within range, regardless of distance
   * 'linear' = force is calculated as strength * distance / range (force decreases the farther a body is from the attractor position)
   * 'newtonian' = force is calculated as gravitationalConstant * mass1 * mass2 / Math.pow(distance, 2)
   * Default: 'static'
   */
  gravityType?: GravityType
  /**
   * The gravitational constant used to calculate force in newtonian calculations. Most people probably won't use this,
   * but it provides an option for more realistic physics simulations.
   * Default: 6.673e-11
   */
  gravitationalConstant?: number
}

type AttractorEvents = Events<Group>

type AttractorSlots = Slots<Group>

export default class Attractor extends SvelteComponentTyped<
  AttractorProps,
  AttractorEvents,
  AttractorSlots
> {}
