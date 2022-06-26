<script lang="ts">
  import World from '$lib/rapier/components/World.svelte'
  import { Canvas } from 'threlte'
  import Scene from './Scene.svelte'
</script>

<Canvas>
  <World>
    <Scene />
  </World>
</Canvas>
