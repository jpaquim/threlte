<script context="module" lang="ts">
  import { useFrame } from '$lib/hooks/useFrame'
  import type { ThrelteContext } from '$lib/types/types'
  import RAPIER from '@dimforge/rapier3d-compat'
  import { getContext, setContext } from 'svelte'
  import { get, writable } from 'svelte/store'
  import { useFramehandler } from '../hooks/useFramehandler'
  import { createRapierContext } from '../lib/context'
  import type { RapierContextStore } from '../lib/contextTypes'

  export const useRapier = () => {
    return get(getContext<RapierContextStore>('rapier-world'))
  }
</script>

<script lang="ts">
  let mounted = false
  let callback: ((ctx: ThrelteContext, delta: number) => void) | undefined

  const rapierContextStore: RapierContextStore = writable(undefined)

  setContext<RapierContextStore>('rapier-world', rapierContextStore)

  useFrame((ctx, delta) => {
    if (!callback) return
    callback(ctx, delta)
  })

  const init = async () => {
    await RAPIER.init()

    let gravity = { x: 0.0, y: -9.81, z: 0.0 }

    rapierContextStore.set(createRapierContext())

    callback = (ctx: ThrelteContext, delta: number) => {
      $rapierContextStore.world.step()
    }
    mounted = true
  }

  useFramehandler(rapierContextStore)

  init()
</script>

{#if mounted}
  <slot />
{/if}
