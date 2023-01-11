import type {
  Audio,
  BufferGeometry,
  ColorRepresentation,
  Material,
  Mesh,
  Object3D,
  PositionalAudio
} from 'three'
import type { Pass } from 'three/examples/jsm/postprocessing/Pass'
import type { SetOptional } from 'type-fest'
import type { LookAt, Position, Rotation, Scale, ThrelteLayers } from './types'

export type HierarchicalObjectProperties = {
  object?: Object3D
  onChildMount?: (child: Object3D) => void
  onChildDestroy?: (child: Object3D) => void
}

export type DisposableThreeObject = {
  dispose?: () => void
  type?: string
} & Record<string, any>

export type DisposableObjectProperties = {
  object?: DisposableThreeObject
  dispose?: boolean
}

export type SceneGraphObjectProperties = {
  object: Object3D
}

export type InteractiveObjectProperties = {
  object: Object3D
  interactive: boolean
  ignorePointer: boolean
}

export type LayerableObjectProperties = {
  object: Object3D
}

export type TransformableObjectProperties = {
  object: Object3D
  position?: Position
  scale?: Scale
  rotation?: Rotation
  lookAt?: LookAt
}

export type ViewportAwareObjectProperties = {
  object: Object3D
  viewportAware: boolean
  /**
   * Use as a binding.
   */
  inViewport: boolean
}

export type Object3DInstanceProperties = SceneGraphObjectProperties &
  LayerableObjectProperties &
  TransformableObjectProperties &
  ViewportAwareObjectProperties &
  DisposableObjectProperties & {
    castShadow?: boolean
    receiveShadow?: boolean
    frustumCulled?: boolean
    renderOrder?: number
    visible?: boolean
    userData?: Record<string, any>
  }

export type MeshInstanceProperties = Omit<Object3DInstanceProperties, 'object'> &
  Omit<InteractiveObjectProperties, 'object'> & {
    mesh: Mesh
  }

export type PassProperties = {
  pass: Pass
}

export type LayersProperties = {
  layers: ThrelteLayers
}

export type InstancedMeshProperties = Omit<MeshInstanceProperties, 'mesh' | 'frustumCulled'> & {
  geometry: BufferGeometry
  material: Material | Material[]
  count?: number
  id?: string
}

export type InstanceProperties = Omit<TransformableObjectProperties, 'object'> & {
  color?: ColorRepresentation
  id?: string
}

export type AudioListenerProperties = Omit<Object3DInstanceProperties, 'object'> & {
  id?: string
  masterVolume?: number
}

type AudioSource = string | AudioBuffer | HTMLMediaElement | AudioBufferSourceNode | MediaStream

export type AudioInstanceProperties<T extends Audio<GainNode> | PositionalAudio> = Omit<
  Object3DInstanceProperties,
  'object'
> & {
  audio: T
  autoplay?: boolean
  detune?: number
  source?: AudioSource
  volume?: number
  loop?: boolean
  filters?: BiquadFilterNode[] | BiquadFilterNode
  playbackRate?: number
  // TODO unknown is used here to be able to directly use
  // the function in a svelte event handler: on:click={play}
  // as otherwise TypeScript will complain about the type
  // of the argument 'delay'. It's not a perfect solution though.
  play: (delay?: number | any) => Promise<T>
  pause: () => T
  stop: () => T
}

export type AudioProperties = Omit<
  SetOptional<AudioInstanceProperties<Audio>, 'play' | 'pause' | 'stop'>,
  'audio'
> & {
  id?: string
}

export type PositionalAudioProperties = Omit<
  SetOptional<AudioInstanceProperties<PositionalAudio>, 'play' | 'pause' | 'stop'>,
  'audio'
> & {
  id?: string
  refDistance?: number
  rolloffFactor?: number
  distanceModel?: string
  maxDistance?: number
  directionalCone?: {
    coneInnerAngle: number
    coneOuterAngle: number
    coneOuterGain: number
  }
}
