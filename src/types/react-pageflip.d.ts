declare module 'react-pageflip' {
  import type { CSSProperties, ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react'

  export type PageOrientation = 'portrait' | 'landscape'
  export type PageState = 'user_fold' | 'fold_corner' | 'flipping' | 'read'
  export type FlipCorner = 'top' | 'bottom'

  export type FlipEvent<T = number> = {
    data: T
    object: PageFlipController
  }

  export type OrientationEvent = FlipEvent<PageOrientation>
  export type StateEvent = FlipEvent<PageState>

  export type PageFlipController = {
    flipNext: (corner?: FlipCorner) => void
    flipPrev: (corner?: FlipCorner) => void
    flip: (page: number, corner?: FlipCorner) => void
    turnToPage: (page: number) => void
    getCurrentPageIndex: () => number
    getPageCount: () => number
    getOrientation: () => PageOrientation
    update: () => void
    destroy: () => void
  }

  export type HTMLFlipBookRef = {
    pageFlip: () => PageFlipController | undefined
  }

  export type HTMLFlipBookProps = {
    children: ReactNode
    className: string
    style: CSSProperties
    width: number
    height: number
    size: 'fixed' | 'stretch'
    minWidth: number
    maxWidth: number
    minHeight: number
    maxHeight: number
    startPage: number
    drawShadow: boolean
    flippingTime: number
    usePortrait: boolean
    startZIndex: number
    autoSize: boolean
    maxShadowOpacity: number
    showCover: boolean
    mobileScrollSupport: boolean
    clickEventForward: boolean
    useMouseEvents: boolean
    swipeDistance: number
    showPageCorners: boolean
    disableFlipByClick: boolean
    renderOnlyPageLengthChange?: boolean
    onFlip?: (event: FlipEvent<number>) => void
    onChangeOrientation?: (event: OrientationEvent) => void
    onChangeState?: (event: StateEvent) => void
    onInit?: (event: FlipEvent<{ page: number; mode: PageOrientation }>) => void
    onUpdate?: (event: FlipEvent<{ page: number; mode: PageOrientation }>) => void
  }

  const HTMLFlipBook: ForwardRefExoticComponent<HTMLFlipBookProps & RefAttributes<HTMLFlipBookRef>>
  export default HTMLFlipBook
}
