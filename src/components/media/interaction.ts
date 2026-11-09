import { useEffect, useRef, type RefObject } from 'react'

/**
 * Chặn các sự kiện kéo/thả để thư viện lật trang không khởi tạo nếp gấp khi
 * người dùng thao tác bên trong một vùng tương tác (thẻ chú giải, dòng thời
 * gian, sơ đồ giai đoạn, video...).
 *
 * QUAN TRỌNG: không được chặn `click` / `dblclick`. React 18/19 uỷ thác toàn
 * bộ synthetic event về root container; stopPropagation() ở đây sẽ làm mọi
 * onClick của nút nằm trong vùng này không bao giờ chạy. Bản thân page-flip đã
 * bỏ qua mousedown có target là <a>/<button> (clickEventForward), nên chỉ cần
 * chặn các sự kiện khởi tạo nếp gấp là đủ.
 */
const blockedEvents = ['mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchmove', 'touchend', 'touchcancel'] as const

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
