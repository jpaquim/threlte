<script lang="ts">
  import { useFrame } from '$lib/hooks/useFrame'
  import { getParent } from '$lib/internal/HierarchicalObject.svelte'
  import {
    RigidBodyDesc,
    ColliderDesc,
    RigidBodyType,
    type Rotation
  } from '@dimforge/rapier3d-compat'
  import { onDestroy } from 'svelte'
  import { Box3, Mesh, Quaternion, Vector3 } from 'three'
  import { getWorld } from './World.svelte'

  const worldContext = getWorld()
  const parent = getParent()

  if (!($parent instanceof Mesh)) throw new Error('Only Mesh')

  export let type: RigidBodyType

  const tempV3 = new Vector3()
  const tempQ = new Quaternion()

  $parent.getWorldPosition(tempV3)
  $parent.getWorldQuaternion(tempQ)

  const r: Rotation = {
    x: tempQ.x,
    y: tempQ.y,
    z: tempQ.z,
    w: tempQ.w
  }

  export const rbDesc = new RigidBodyDesc(type)
    .setTranslation(tempV3.x, tempV3.y, tempV3.z)
    .setRotation(r)
  export const rigidBody = worldContext.world.createRigidBody(rbDesc)

  const box = new Box3()

  $parent.geometry.computeBoundingBox()
  box.copy($parent.geometry.boundingBox)

  box.getSize(tempV3)

  console.log(tempV3)

  export const colliderDesc = ColliderDesc.cuboid(tempV3.x / 2, tempV3.z / 2, tempV3.y / 2)
  export const collider = worldContext.world.createCollider(colliderDesc, rigidBody)

  useFrame(() => {
    const p = rigidBody.translation()
    $parent.position.set(p.x, p.y, p.z)
    const r = rigidBody.rotation()
    $parent.quaternion.set(r.x, r.y, r.z, r.w)
  })

  onDestroy(() => {
    worldContext.world.removeCollider(collider, true)
  })
</script>
