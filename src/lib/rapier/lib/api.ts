import type {
  Collider,
  ColliderDesc,
  ImpulseJoint,
  JointData,
  RigidBody,
  RigidBodyDesc,
  World
} from '@dimforge/rapier3d-compat'

export const createWorldApi = (world: World) => {
  return {
    getRigidBody: (handle: number) => world.getRigidBody(handle),
    createRigidBody: (desc: RigidBodyDesc) => world.createRigidBody(desc),
    removeRigidBody: (rigidBody: RigidBody) => world.removeRigidBody(rigidBody),

    getCollider: (handle: number) => world.getCollider(handle),
    createCollider: (desc: ColliderDesc, rigidBody: RigidBody) =>
      world.createCollider(desc, rigidBody),
    removeCollider: (collider: Collider) => world.removeCollider(collider, true),

    createImpulseJoint: (
      params: JointData,
      rigidBodyA: RigidBody,
      rigidBodyB: RigidBody,
      wakeUp: boolean
    ) => world.createImpulseJoint(params, rigidBodyA, rigidBodyB, wakeUp),
    removeImpulseJoint: (joint: ImpulseJoint) => world.removeImpulseJoint(joint, true),

    forEachCollider: (callback: (collider: Collider) => void) => world.forEachCollider(callback)
  }
}
