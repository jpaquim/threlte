<script lang="ts">
	import { InteractiveObject, T } from '@threlte/core'
	import { Float } from '@threlte/extras'
	import { onDestroy } from 'svelte'
	import { spring } from 'svelte/motion'
	import { Color, MeshPhysicalMaterial, type BufferGeometry } from 'three'

	export let geometry: BufferGeometry

	const red = new Color('#FF3E00').convertSRGBToLinear()
	const blue = new Color('#0000ff').convertSRGBToLinear()

	let material = new MeshPhysicalMaterial({
		color: red,
		reflectivity: 1,
		metalness: 0.9,
		roughness: 0.2
	})
	onDestroy(() => {
		material.dispose()
	})

	const scale = spring(1)

	const onPointerEnter = () => {
		material.color = blue
		scale.set(1.1)
	}

	const onPointerLeave = () => {
		material.color = red
		scale.set(1)
	}
</script>

<Float floatIntensity={5} scale={$scale} rotationIntensity={2} rotationSpeed={[1, 0.5, 0.2]}>
	<T.Mesh {geometry} {material} let:ref>
		<InteractiveObject
			object={ref}
			interactive
			on:pointerenter={onPointerEnter}
			on:pointerleave={onPointerLeave}
		/>
	</T.Mesh>
</Float>
