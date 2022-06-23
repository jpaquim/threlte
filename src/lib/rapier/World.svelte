<script context="module" lang="ts">
  import { getContext, setContext } from 'svelte'
  import type { RapierWorldContext } from './contextTypes'
  export const getWorld = () => getContext<RapierWorldContext>('rapier-world')
</script>

<script lang="ts">
  import RAPIER from '@dimforge/rapier3d-compat'
  import { useFrame } from '$lib/hooks/useFrame'
  import type { ThrelteContext } from '$lib/types/types'

  let mounted = false
  let callback: ((ctx: ThrelteContext, delta: number) => void) | undefined
  const rapierWorldContext: RapierWorldContext = {
    world: undefined
  }

  setContext<RapierWorldContext>('rapier-world', rapierWorldContext)

  useFrame((ctx, delta) => {
    if (!callback) return
    callback(ctx, delta)
  })

  const init = async () => {
    await RAPIER.init()
    let gravity = { x: 0.0, y: -9.81, z: 0.0 }
    rapierWorldContext.world = new RAPIER.World(gravity)

    callback = (ctx: ThrelteContext, delta: number) => {
      rapierWorldContext.world.step()
    }
    mounted = true
  }

  init()
</script>

{#if mounted}
  <slot />
{/if}
