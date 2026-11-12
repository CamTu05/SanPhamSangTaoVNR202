import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HTMLFlipBook, { type FlipEvent, type HTMLFlipBookRef, type OrientationEvent, type PageOrientation } from 'react-pageflip'
import { bookDefinition } from '../data/bookPages'
import { approvedSources } from '../data/mediaManifest'
import { BookPage } from './BookPage'
import { SourcesDialog } from './SourcesDialog'
import { getPhysicalSpread } from './readerParity'

/** Chỉ bỏ qua phím lật trang khi focus đang nằm trong widget tự xử lý phím mũi tên. */
function consumesArrows(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest('select, input, textarea, [contenteditable="true"], .animated-timeline, .phase-controls, .strategy-tabs'))
}

export function HistoryBook() {
  const bookRef = useRef<HTMLFlipBookRef>(null)
  const requestedPageRef = useRef<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [orientation, setOrientation] = useState<PageOrientation>('landscape')
  const [tocOpen, setTocOpen] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const sourcesTriggerRef = useRef<HTMLButtonElement>(null)
  const pages = bookDefinition.pages
  const lastIndex = pages.length - 1
  const normalizedPage = Math.max(0, Math.min(currentPage, lastIndex))
  const isLandscape = orientation === 'landscape'
  const pageIndexById = useMemo(() => new Map(pages.map((page, index) => [page.id, index])), [pages])
  const currentDefinition = pages[normalizedPage]
  const currentChapter = bookDefinition.chapters.find((chapter) => chapter.pageIds.includes(currentDefinition.id))
  const physicalSpread = isLandscape ? getPhysicalSpread(normalizedPage, lastIndex) : [normalizedPage]
  const visiblePages = physicalSpread
  const spreadLead = physicalSpread[0]

  /** Trong chế độ hai trang, chỉ trang trái (lẻ) là điểm dừng hợp lệ. */
  const navigableIndexes = useMemo(() => {
    if (!isLandscape) return pages.map((_, index) => index)
    const odds = Array.from({ length: lastIndex - 1 }, (_, i) => i + 1).filter((i) => i % 2 === 1)
    return [0, ...odds, lastIndex]
  }, [isLandscape, lastIndex, pages])

  const spreadLabel = (index: number) => {
    if (index === 0) return 'Bìa trước'
    if (index === lastIndex) return 'Bìa sau'
    const pair = isLandscape ? getPhysicalSpread(index, lastIndex) : [index]
    return pair.length === 2
      ? `Nội dung ${String(pair[0]).padStart(2, '0')}–${String(pair[1]).padStart(2, '0')}`
      : `Nội dung ${String(index).padStart(2, '0')}`
  }

  const goToIndex = useCallback((index: number) => {
    const requested = Math.max(0, Math.min(index, lastIndex))
    let physical = requested
    if (isLandscape && physical > 0 && physical < lastIndex && physical % 2 === 0) physical -= 1
    requestedPageRef.current = requested
    setCurrentPage(requested)
    requestAnimationFrame(() => bookRef.current?.pageFlip()?.turnToPage(physical))
  }, [isLandscape, lastIndex])
  const goToPage = useCallback((id: string) => {
    const index = pageIndexById.get(id)
    if (index === undefined) return
    setTocOpen(false)
    requestAnimationFrame(() => goToIndex(index))
  }, [goToIndex, pageIndexById])
  const goPrevious = useCallback(() => {
    const controller = bookRef.current?.pageFlip()
    if (controller) controller.flipPrev()
    else setCurrentPage((page) => Math.max(0, page - 1))
  }, [])
  const goNext = useCallback(() => {
    const controller = bookRef.current?.pageFlip()
    if (controller) controller.flipNext()
    else setCurrentPage((page) => Math.min(lastIndex, page + 1))
  }, [lastIndex])

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (sourcesOpen) return
      if (event.key === 'Escape' && tocOpen) { event.preventDefault(); setTocOpen(false); return }
      if (consumesArrows(event.target)) return
      if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); goPrevious() }
      if (['ArrowRight', 'PageDown'].includes(event.key)) { event.preventDefault(); goNext() }
      if (event.key === 'Home') { event.preventDefault(); goToIndex(0) }
      if (event.key === 'End') { event.preventDefault(); goToIndex(lastIndex) }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [goNext, goPrevious, goToIndex, lastIndex, sourcesOpen, tocOpen])

  const physicalLabel = spreadLabel(spreadLead)
  const counter = physicalSpread.length === 2
    ? `${physicalSpread[0] + 1}–${physicalSpread[1] + 1}/${pages.length}`
    : `${normalizedPage + 1}/${pages.length}`

  return <main className="reader-shell">
    <header className="reader-header"><div><p className="eyebrow">{bookDefinition.eyebrow}</p><h1>{bookDefinition.title}</h1></div><p className="reader-period">{bookDefinition.period}</p><div className="reader-header__actions"><button ref={sourcesTriggerRef} className="sources-toggle" type="button" aria-haspopup="dialog" aria-expanded={sourcesOpen} onClick={() => setSourcesOpen(true)}>Nguồn tư liệu</button><button className="toc-toggle" type="button" aria-expanded={tocOpen} aria-controls="book-toc" onClick={() => setTocOpen((open) => !open)}>Mục lục</button></div></header>
    <nav id="book-toc" className={`book-toc${tocOpen ? ' is-open' : ''}`} aria-label="Mục lục chương" aria-hidden={!tocOpen} inert={!tocOpen}>
      {bookDefinition.parts.map((part) => <div className="toc-group" key={part.id}>
        <button className="toc-part" type="button" onClick={() => goToPage(part.pageIds[0])}><span>{part.title}</span><small>{part.period}</small></button>
        {bookDefinition.chapters.filter((chapter) => chapter.partIds?.includes(part.id) ?? chapter.partId === part.id).map((chapter) => <button className="toc-chapter" key={chapter.id} type="button" aria-current={currentChapter?.id === chapter.id ? 'page' : undefined} onClick={() => goToPage(chapter.pageIds[0])}><span>{chapter.title}</span><small>{chapter.period}</small></button>)}
      </div>)}
    </nav>
    <section className="book-stage" aria-label="Sách lịch sử tương tác"><HTMLFlipBook ref={bookRef} className="history-book" style={{}} width={430} height={600} size="stretch" minWidth={300} maxWidth={430} minHeight={420} maxHeight={600} startPage={0} drawShadow flippingTime={650} usePortrait startZIndex={0} autoSize maxShadowOpacity={0.45} showCover mobileScrollSupport clickEventForward useMouseEvents swipeDistance={40} showPageCorners disableFlipByClick={false} onFlip={(event: FlipEvent<number>) => { const flipped = Math.max(0, Math.min(event.data, lastIndex)); const requested = requestedPageRef.current; if (requested !== null && getPhysicalSpread(requested, lastIndex).includes(flipped)) { setCurrentPage(requested); requestedPageRef.current = null } else { requestedPageRef.current = null; setCurrentPage(flipped) } }} onChangeOrientation={(event: OrientationEvent) => setOrientation(event.data)}>{pages.map((page, index) => <BookPage key={page.id} page={page} pageNumber={index} lastIndex={lastIndex} isActive={visiblePages.includes(index)} onNavigatePage={goToPage} />)}</HTMLFlipBook></section>
    <nav className="reader-controls" aria-label="Điều hướng trang"><button type="button" onClick={goPrevious} disabled={normalizedPage === 0}>← Trang trước</button><label className="page-status"><span className="visually-hidden">Đi đến trang</span><select value={spreadLead} onChange={(event) => goToIndex(Number(event.target.value))}>{navigableIndexes.map((index) => <option key={index} value={index}>{spreadLabel(index)} — {pages[index].title}</option>)}</select></label><button type="button" onClick={goNext} disabled={normalizedPage === lastIndex}>Trang sau →</button></nav>
    <p className="reader-context" aria-live="polite">{currentDefinition.title} · {physicalLabel} · {counter}</p>
    <p className="reader-hint">Kéo góc trang, dùng nút hoặc phím mũi tên, Page Up, Page Down, Home và End.</p>
    <SourcesDialog open={sourcesOpen} sources={approvedSources} onClose={() => setSourcesOpen(false)} triggerRef={sourcesTriggerRef} />
  </main>
}
