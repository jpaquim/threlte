import { getContext } from 'svelte'
import { get } from 'svelte/store'
import type { RapierContextStore, RapierContext } from '../lib/contextTypes'

export const useRapier = (): RapierContext => {
  return get(getContext<RapierContextStore>('rapier-world'))
}
