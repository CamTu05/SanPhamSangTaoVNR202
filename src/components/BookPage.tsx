import { forwardRef, memo, useEffect, useRef, useState } from 'react'
import type { BookPageDefinition } from '../types/book'
import { BackCoverLayout, ComparisonLayout, CoverLayout, StandardLayout, StrategyLayout, TimelineLayout, TocLayout } from './layouts/PageLayouts'

type BookPageProps = { page: BookPageDefinition; pageNumber: number; lastIndex: number; isActive: boolean; onNavigatePage?: (pageId: string) => void }

function PageLayout(props: BookPageProps) {
  switch (props.page.layout) {
    case 'cover': return <CoverLayout {...props} />
    case 'back-cover': return <BackCoverLayout {...props} />
    case 'timeline': return <TimelineLayout {...props} />
    case 'strategy-tabs': return <StrategyLayout {...props} />
    case 'toc': return <TocLayout {...props} />
    case 'comparison': return <ComparisonLayout {...props} />
    case 'reading-instructions':
    case 'story':
    case 'cards':
    case 'schematic':
    case 'reference': return <StandardLayout {...props} />
  }
}

/** Phát hiện nội dung bị tràn để hiện gợi ý cuộn rõ ràng thay vì để người đọc tưởng bị cụt chữ. */
function useScrollHint(active: boolean) {
  const ref = useRef<HTMLElement | null>(null)
  const [scrollable, setScrollable] = useState(false)

  useEffect(() => {
    if (!active) { setScrollable(false); return }
    const root = ref.current
    const scroller = root?.querySelector<HTMLElement>('.page-scroll')
    if (!scroller) return
    let frame = 0
    const measure = () => setScrollable(scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop > 10)
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
    measure()
    const ro = new ResizeObserver(schedule)
    ro.observe(scroller)
    Array.from(scroller.children).forEach((child) => ro.observe(child))
    const mo = new MutationObserver(schedule)
    mo.observe(scroller, { childList: true, subtree: true, characterData: true })
    scroller.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect(); mo.disconnect()
      scroller.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [active])

  return { ref, scrollable }
}

const BookPageComponent = forwardRef<HTMLElement, BookPageProps>((props, ref) => {
  const { page, pageNumber, lastIndex, isActive } = props
  const { ref: hintRef, scrollable } = useScrollHint(isActive)
  const isOuterCover = pageNumber === 0
  const isBackCover = pageNumber === lastIndex
  const physicalLabel = isOuterCover ? 'Bìa trước' : isBackCover ? 'Bìa sau' : `Nội dung ${String(pageNumber).padStart(2, '0')}`
  const inertProps = { inert: !isActive } as React.HTMLAttributes<HTMLElement>
  return <article
    ref={(node) => {
      hintRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }}
    {...inertProps}
    className={`book-page book-page--${page.layout}${isOuterCover ? ' book-page--outer-cover' : ''}${page.layout === 'cover' && !isOuterCover ? ' book-page--inner-title' : ''}`}
    data-density={isOuterCover || isBackCover ? 'hard' : undefined}
    data-scrollable={scrollable ? 'true' : undefined}
    data-physical-role={isOuterCover ? 'front-cover' : isBackCover ? 'back-cover' : 'content'}
    data-physical-side={page.side ?? (isOuterCover || isBackCover ? 'cover' : undefined)}
    data-side={page.side ?? 'cover'}
    aria-hidden={!isActive}
    aria-label={`${physicalLabel}: ${page.title}`}>
    <div className="paper-grain" aria-hidden="true" />
    <PageLayout {...props} />
    {pageNumber > 0 && pageNumber < lastIndex && <span className="folio">{String(pageNumber).padStart(2, '0')}</span>}
    {scrollable && <span className="scroll-cue" aria-hidden="true">Cuộn để xem tiếp ↓</span>}
  </article>
})
BookPageComponent.displayName = 'BookPage'
export const BookPage = memo(BookPageComponent)
