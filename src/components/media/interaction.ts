import { useEffect, useRef, type RefObject } from 'react'

const blockedEvents = ['mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'click', 'dblclick'] as const

export function usePageFlipBoundary<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const stop = (event: Event) => event.stopPropagation()
    blockedEvents.forEach((name) => node.addEventListener(name, stop))
    return () => blockedEvents.forEach((name) => node.removeEventListener(name, stop))
  }, [])

  return ref
}
