import type { BufferGeometry, ColorRepresentation, Material, Mesh, Object3D } from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { Pass } from 'three/examples/jsm/postprocessing/Pass'
import type { LookAt, Position, Rotation, Scale } from './types'

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

type TransformableObjectProperties = {
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

export type MeshInstanceProperties = Omit<Object3DInstanceProperties, 'object'> & {
  mesh: Mesh
}

export type PassProperties = {
  pass: Pass
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
