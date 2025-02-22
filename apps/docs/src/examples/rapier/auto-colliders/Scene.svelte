<script lang="ts">
	import { OrbitControls, T } from '@threlte/core'
	import { Environment, useGltf } from '@threlte/extras'
	import { AutoColliders, RigidBody } from '@threlte/rapier'
	import { derived } from 'svelte/store'
	import type { MeshStandardMaterial, Mesh } from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
	import Ground from './Ground.svelte'

	const gltf = useGltf<{
		nodes: {
			'node_damagedHelmet_-6514': Mesh
		}
		materials: {
			Material_MR: MeshStandardMaterial
		}
	}>('/models/helmet/DamagedHelmet.gltf')

	const helmet = derived(gltf, (gltf) => {
		if (!gltf || !gltf.nodes['node_damagedHelmet_-6514']) return
		return gltf.nodes['node_damagedHelmet_-6514']
	})
</script>

<Environment path="/hdr/" files="shanghai_riverside_1k.hdr" />

<T.PerspectiveCamera makeDefault position.x={12} position.y={13} fov={40}>
	<OrbitControls target={{ x: 2.5 }} />
</T.PerspectiveCamera>

<T.DirectionalLight castShadow position={[8, 20, -3]} />

{#if $helmet}
	<RigidBody position={[-2.5, 2, 2.5]} rotation={[90 * DEG2RAD, 0, 0]}>
		<AutoColliders shape={'convexHull'}>
			<T.Mesh castShadow geometry={$helmet.geometry} material={$helmet.material} />
		</AutoColliders>
	</RigidBody>

	<RigidBody position={[2.5, 2, 2.5]} rotation={[90 * DEG2RAD, 0, 0]}>
		<AutoColliders shape={'ball'}>
			<T.Mesh castShadow geometry={$helmet.geometry} material={$helmet.material} />
		</AutoColliders>
	</RigidBody>

	<RigidBody position={[2.5, 2, -2.5]} rotation={[90 * DEG2RAD, 0, 0]}>
		<AutoColliders shape={'cuboid'}>
			<T.Mesh castShadow geometry={$helmet.geometry} material={$helmet.material} />
		</AutoColliders>
	</RigidBody>

	<RigidBody position={[0, 2, 0]} rotation={[90 * DEG2RAD, 0, 0]}>
		<AutoColliders shape={'trimesh'}>
			<T.Mesh castShadow geometry={$helmet.geometry} material={$helmet.material} />
		</AutoColliders>
	</RigidBody>

	<RigidBody position={[-2.5, 2, -2.5]} rotation={[90 * DEG2RAD, 0, 0]}>
		<AutoColliders shape={'capsule'}>
			<T.Mesh castShadow geometry={$helmet.geometry} material={$helmet.material} />
		</AutoColliders>
	</RigidBody>
{/if}

<T.GridHelper args={[50]} />

<Ground />
