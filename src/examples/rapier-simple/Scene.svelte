<script lang="ts">
  import RigidBody from '$lib/rapier/RigidBody.svelte'
  import { RigidBodyType } from '@dimforge/rapier3d-compat'
  import { onDestroy } from 'svelte'
  import { BoxBufferGeometry, GridHelper, MeshStandardMaterial, PlaneBufferGeometry } from 'three'
  import { DEG2RAD } from 'three/src/math/MathUtils'
  import { DirectionalLight, Mesh, OrbitControls, PerspectiveCamera, useThrelte } from 'threlte'

  const gridHelper = new GridHelper(10, 10)
  const { scene } = useThrelte()
  scene.add(gridHelper)
  onDestroy(() => {
    scene.remove(gridHelper)
  })
</script>

<PerspectiveCamera position={{ y: 5, z: 10, x: 10 }} lookAt={{ y: 0 }}>
  <OrbitControls />
</PerspectiveCamera>

<DirectionalLight position={{ y: 10, z: 10 }} />

<Mesh
  position={{ y: 2 }}
  geometry={new BoxBufferGeometry(2, 2, 2)}
  material={new MeshStandardMaterial()}
>
  <RigidBody type={RigidBodyType.Dynamic} />
</Mesh>

<Mesh
  position={{ y: 5, z: 1 }}
  geometry={new BoxBufferGeometry(2, 2, 2)}
  material={new MeshStandardMaterial()}
>
  <RigidBody type={RigidBodyType.Dynamic} />
</Mesh>

<Mesh
  position={{ y: -5, z: 0.5 }}
  rotation={{ x: -90 * DEG2RAD }}
  geometry={new BoxBufferGeometry(10, 10, 2)}
  material={new MeshStandardMaterial()}
>
  <RigidBody type={RigidBodyType.Fixed} />
</Mesh>
