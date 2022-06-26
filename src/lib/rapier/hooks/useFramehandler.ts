import { useFrame } from '$lib/hooks/useFrame'
import { EventQueue } from '@dimforge/rapier3d-compat'
import { onDestroy } from 'svelte'
import { get } from 'svelte/store'
import { Object3D, Quaternion, Vector3 } from 'three'
import type { RapierContextStore } from '../lib/contextTypes'

export const useFramehandler = (rapierContextStore: RapierContextStore) => {
  let eventQueue: EventQueue | undefined = undefined

  let rapierContext = get(rapierContextStore)
  const unsubscribeRapierContextStore = rapierContextStore.subscribe((r) => {
    rapierContext = r
    if (r) {
      if (eventQueue) eventQueue.free()
      eventQueue = new EventQueue(false)
    }
  })
  onDestroy(unsubscribeRapierContextStore)

  let time = performance.now()

  useFrame(() => {
    if (!rapierContext || !eventQueue) return
    const { world } = rapierContext

    // Set timestep to current delta, to allow for variable frame rates
    // We cap the delta at 100, so that the physics simulation doesn't get wild
    const now = performance.now()
    const delta = Math.min(100, now - time)

    world.timestep = delta / 1000
    world.step(eventQueue)

    // Update meshes
    rapierContext.rigidBodyMeshes.forEach((mesh, handle) => {
      const rigidBody = world.getRigidBody(handle)

      const events = rapierContext.rigidBodyEvents.get(handle)
      if (events?.onSleep || events?.onWake) {
        if (rigidBody.isSleeping() && !mesh.userData.isSleeping) {
          events?.onSleep?.()
        }
        if (!rigidBody.isSleeping() && mesh.userData.isSleeping) {
          events?.onWake?.()
        }
        mesh.userData.isSleeping = rigidBody.isSleeping()
      }

      if (!rigidBody || rigidBody.isSleeping() || rigidBody.isFixed() || !mesh.parent) {
        return
      }

      const { x, y, z } = rigidBody.translation()
      const { x: rx, y: ry, z: rz, w: rw } = rigidBody.rotation()
      const scale = mesh.getWorldScale(new Vector3())

      // haha matrixes I have no idea what I'm doing :)
      const o = new Object3D()
      o.position.set(x, y, z)
      o.rotation.setFromQuaternion(new Quaternion(rx, ry, rz, rw))
      o.scale.set(scale.x, scale.y, scale.z)
      o.updateMatrix()

      o.applyMatrix4(mesh.parent.matrixWorld.clone().invert())
      o.updateMatrix()

      mesh.position.setFromMatrixPosition(o.matrix)
      mesh.rotation.setFromRotationMatrix(o.matrix)
    })

    // Collision events
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      const collider1 = world.getCollider(handle1)
      const collider2 = world.getCollider(handle2)

      const rigidBody1 = collider1.parent()
      const rigidBody2 = collider2.parent()

      if (!collider1 || !collider2 || !rigidBody1 || !rigidBody2) {
        return
      }

      const events1 = rapierContext.rigidBodyEvents.get(rigidBody1.handle)
      const events2 = rapierContext.rigidBodyEvents.get(rigidBody2.handle)

      if (started) {
        world.contactPair(collider1, collider2, (manifold, flipped) => {
          console.log('event!')

          events1?.onCollisionEnter?.({ target: rigidBody2, manifold, flipped })
          events2?.onCollisionEnter?.({ target: rigidBody1, manifold, flipped })
        })
      } else {
        events1?.onCollisionExit?.({ target: rigidBody2 })
        events2?.onCollisionExit?.({ target: rigidBody1 })
      }
    })

    time = now
  })
}
