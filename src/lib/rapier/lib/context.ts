import RAPIER from '@dimforge/rapier3d-compat'
import { createWorldApi } from './api'
import type { RapierContext } from './contextTypes'

export const createRapierContext = (): RapierContext => {
  const world = new RAPIER.World({
    x: 0,
    y: -9.81,
    z: 0
  })
  return {
    rapier: RAPIER,
    world,
    colliderMeshes: new Map(),
    rigidBodyMeshes: new Map(),
    rigidBodyEvents: new Map(),
    ...createWorldApi(world)
  }
}
