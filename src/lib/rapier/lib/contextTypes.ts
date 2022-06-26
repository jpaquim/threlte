import type Rapier from '@dimforge/rapier3d-compat'
import type {
  ColliderHandle,
  RigidBody,
  RigidBodyHandle,
  TempContactManifold,
  World
} from '@dimforge/rapier3d-compat'
import type { Writable } from 'svelte/store'
import type { Object3D } from 'three'
import type { createWorldApi } from './api'

export type RigidBodyAutoCollider = 'ball' | 'cuboid' | 'hull' | 'trimesh' | false

export type EventMap = Map<
  ColliderHandle | RigidBodyHandle,
  {
    onSleep?(): void
    onWake?(): void
    onCollisionEnter?({
      target,
      manifold,
      flipped
    }: {
      target: RigidBody
      manifold: TempContactManifold
      flipped: boolean
    }): void
    onCollisionExit?({ target }: { target: RigidBody }): void
  }
>

export type RapierContext =
  | ReturnType<typeof createWorldApi> & {
      rapier: typeof Rapier
      world: World
      colliderMeshes: Map<ColliderHandle, Object3D>
      rigidBodyMeshes: Map<ColliderHandle, Object3D>
      rigidBodyEvents: EventMap
    }

export type RapierContextStore = Writable<RapierContext | undefined>
