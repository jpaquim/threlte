import { getContext, onDestroy } from 'svelte'
import { readable, writable } from 'svelte/store'
import { browser } from '../lib/browser'
import type {
  ThrelteContext,
  ThrelteFrameHandler,
  ThrelteInternalContext,
  ThrelteUseFrame,
  ThrelteUseFrameOptions
} from '../types/types'

/**
 * Adds a handler to threltes unified render loop.
 *
 * `start` and `stop` functions are returned and the options allow
 * setting the handler to not start automatically.
 *
 * Provide an order to have your framehandlers running in a specific order.
 * Handlers are ordered from low to high when executing.
 * @param {(ctx: ThrelteContext, delta: number) => void} fn callback function
 * @param {ThrelteUseFrameOptions} options options
 * @returns {ThrelteUseFrame}
 */
export const useFrame = (
  fn: (ctx: ThrelteContext, delta: number) => void,
  options?: ThrelteUseFrameOptions
): ThrelteUseFrame => {
  if (!browser) {
    return {
      start: () => undefined,
      stop: () => undefined,
      started: readable(false)
    }
  }

  const invalidate = options?.invalidate ?? true

  const renderCtx = getContext<ThrelteInternalContext>('threlte-internal-context')

  const handler: ThrelteFrameHandler = {
    fn,
    order: options?.order,
    debugFrameloopMessage: options?.debugFrameloopMessage,
    invalidate
  }

  const started = writable(false)

  const stop = () => {
    if (invalidate) {
      renderCtx.autoFrameHandlers.delete(handler)
    } else {
      renderCtx.manualFrameHandlers.delete(handler)
    }
    renderCtx.allFrameHandlers.delete(handler)

    started.set(false)
  }

  const start = () => {
    if (invalidate) {
      renderCtx.autoFrameHandlers.add(handler)
    } else {
      renderCtx.manualFrameHandlers.add(handler)
    }
    renderCtx.allFrameHandlers.add(handler)

    started.set(true)
  }

  if (options?.autostart ?? true) {
    start()
  }

  onDestroy(() => {
    stop()
  })

  return {
    start,
    stop,
    started: {
      subscribe: started.subscribe
    }
  }
}
