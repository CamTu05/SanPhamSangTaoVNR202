import { forwardRef, memo } from 'react'
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

const BookPageComponent = forwardRef<HTMLElement, BookPageProps>((props, ref) => {
  const { page, pageNumber, lastIndex, isActive } = props
  const isOuterCover = pageNumber === 0
  const isBackCover = pageNumber === lastIndex
  const physicalLabel = isOuterCover ? 'Bìa trước' : isBackCover ? 'Bìa sau' : `Nội dung ${String(pageNumber).padStart(2, '0')}`
  const inertProps = { inert: !isActive } as React.HTMLAttributes<HTMLElement>
  return <article
    ref={ref}
    {...inertProps}
    className={`book-page book-page--${page.layout}${isOuterCover ? ' book-page--outer-cover' : ''}${page.layout === 'cover' && !isOuterCover ? ' book-page--inner-title' : ''}`}
    data-density={isOuterCover || isBackCover ? 'hard' : undefined}
    data-physical-role={isOuterCover ? 'front-cover' : isBackCover ? 'back-cover' : 'content'}
    data-physical-side={page.side ?? (isOuterCover || isBackCover ? 'cover' : undefined)}
    data-side={page.side ?? 'cover'}
    aria-hidden={!isActive}
    aria-label={`${physicalLabel}: ${page.title}`}>
    <div className="paper-grain" aria-hidden="true" />
    <PageLayout {...props} />
    {pageNumber > 0 && pageNumber < lastIndex && <span className="folio">{String(pageNumber).padStart(2, '0')}</span>}
  </article>
})
BookPageComponent.displayName = 'BookPage'
export const BookPage = memo(BookPageComponent)
