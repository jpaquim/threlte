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
  import { Box3, Euler, Mesh, Quaternion, Vector3 } from 'three'
  import { useRapier } from './World.svelte'

  const { createRigidBody, createCollider, rigidBodyMeshes, removeRigidBody } = useRapier()

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

  console.log('translation', tempV3)
  export const rbDesc = new RigidBodyDesc(type)

  const box = new Box3()

  $parent.geometry.computeBoundingBox()
  box.copy($parent.geometry.boundingBox)

  box.getSize(tempV3)

  console.log('size', tempV3)

  export const colliderDesc = ColliderDesc.cuboid(tempV3.x / 2, tempV3.z / 2, tempV3.y / 2)

  const rigidBody = createRigidBody(rbDesc)

  const worldPosition = $parent.getWorldPosition(new Vector3())

  const worldRotation = $parent.getWorldQuaternion(new Quaternion())
  const scale = $parent.parent?.getWorldScale(new Vector3()) || { x: 1, y: 1, z: 1 }

  // Set initial transforms based on world transforms
  rigidBody.setTranslation(
    {
      x: worldPosition.x * scale.x,
      y: worldPosition.y * scale.y,
      z: worldPosition.z * scale.z
    },
    false
  )

  const eulerAngles = new Euler()
  const rotation = new Quaternion().setFromEuler(eulerAngles).multiply(worldRotation)

  rigidBody.setRotation({ x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }, false)

  rigidBody.resetForces(false)
  rigidBody.resetTorques(false)

  rigidBody.wakeUp()

  createCollider(colliderDesc, rigidBody)

  rigidBodyMeshes.set(rigidBody.handle, $parent)
  onDestroy(() => {
    removeRigidBody(rigidBody)
    rigidBodyMeshes.delete(rigidBody.handle)
  })
</script>
