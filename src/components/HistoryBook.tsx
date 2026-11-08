import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HTMLFlipBook, { type FlipEvent, type HTMLFlipBookRef, type OrientationEvent, type PageOrientation } from 'react-pageflip'
import { bookDefinition } from '../data/bookPages'
import { BookPage } from './BookPage'
import { getPhysicalSpread } from './readerParity'

function isInteractive(target: EventTarget | null) { return target instanceof HTMLElement && Boolean(target.closest('button, a, input, select, textarea, video, [contenteditable="true"], .interactive-boundary')) }

export function HistoryBook() {
  const bookRef = useRef<HTMLFlipBookRef>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [orientation, setOrientation] = useState<PageOrientation>('landscape')
  const [tocOpen, setTocOpen] = useState(false)
  const pages = bookDefinition.pages
  const lastIndex = pages.length - 1
  const normalizedPage = Math.max(0, Math.min(currentPage, lastIndex))
  const pageIndexById = useMemo(() => new Map(pages.map((page, index) => [page.id, index])), [pages])
  const currentDefinition = pages[normalizedPage]
  const currentChapter = bookDefinition.chapters.find((chapter) => chapter.pageIds.includes(currentDefinition.id))
  const physicalSpread = getPhysicalSpread(normalizedPage, lastIndex)
  const visiblePages = orientation === 'portrait' ? [normalizedPage] : physicalSpread

  const goToIndex = useCallback((index: number) => {
    const safe = Math.max(0, Math.min(index, pages.length - 1))
    const controller = bookRef.current?.pageFlip()
    if (controller) controller.turnToPage(safe)
    else setCurrentPage(safe)
  }, [pages.length])
  const goToPage = useCallback((id: string) => { const index = pageIndexById.get(id); if (index !== undefined) { goToIndex(index); setTocOpen(false) } }, [goToIndex, pageIndexById])
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
      if (event.key === 'Escape' && tocOpen) { event.preventDefault(); setTocOpen(false); return }
      if (isInteractive(event.target)) return
      if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); goPrevious() }
      if (['ArrowRight', 'PageDown'].includes(event.key)) { event.preventDefault(); goNext() }
      if (event.key === 'Home') { event.preventDefault(); goToIndex(0) }
      if (event.key === 'End') { event.preventDefault(); goToIndex(lastIndex) }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [goNext, goPrevious, goToIndex, lastIndex, tocOpen])

  const physicalLabel = normalizedPage === 0 ? 'Bìa trước' : normalizedPage === lastIndex ? 'Bìa sau' : `Nội dung ${String(normalizedPage).padStart(2, '0')}`
  return <main className="reader-shell">
    <header className="reader-header"><div><p className="eyebrow">{bookDefinition.eyebrow}</p><h1>{bookDefinition.title}</h1></div><p className="reader-period">{bookDefinition.period}</p><button className="toc-toggle" type="button" aria-expanded={tocOpen} aria-controls="book-toc" onClick={() => setTocOpen((open) => !open)}>Mục lục</button></header>
    {tocOpen && <nav id="book-toc" className="book-toc is-open" aria-label="Mục lục chương">{bookDefinition.parts.map((part) => <div key={part.id}><button type="button" onClick={() => goToPage(part.pageIds[0])}><span>{part.title}</span><small>{part.period}</small></button>{bookDefinition.chapters.filter((chapter) => chapter.partId === part.id).map((chapter) => <button key={chapter.id} type="button" aria-current={currentChapter?.id === chapter.id ? 'page' : undefined} onClick={() => goToPage(chapter.pageIds[0])}><span>{chapter.title}</span><small>{chapter.period}</small></button>)}</div>)}</nav>}
    <section className="book-stage" aria-label="Sách lịch sử tương tác"><HTMLFlipBook ref={bookRef} className="history-book" style={{}} width={430} height={600} size="stretch" minWidth={300} maxWidth={430} minHeight={420} maxHeight={600} startPage={0} drawShadow flippingTime={850} usePortrait startZIndex={0} autoSize maxShadowOpacity={0.45} showCover mobileScrollSupport clickEventForward useMouseEvents swipeDistance={30} showPageCorners disableFlipByClick={false} onFlip={(event: FlipEvent<number>) => setCurrentPage(Math.max(0, Math.min(event.data, lastIndex)))} onChangeOrientation={(event: OrientationEvent) => setOrientation(event.data)}>{pages.map((page, index) => <BookPage key={page.id} page={page} pageNumber={index} lastIndex={lastIndex} isActive={visiblePages.includes(index)} onNavigatePage={goToPage} />)}</HTMLFlipBook></section>
    <nav className="reader-controls" aria-label="Điều hướng trang"><button type="button" onClick={goPrevious} disabled={normalizedPage === 0}>← Trang trước</button><label className="page-status"><span className="visually-hidden">Đi đến trang</span><select value={normalizedPage} onChange={(event) => goToIndex(Number(event.target.value))}>{pages.map((page, index) => <option key={page.id} value={index}>{index === 0 ? 'Bìa trước' : index === lastIndex ? 'Bìa sau' : `Nội dung ${String(index).padStart(2, '0')}`} — {page.title}</option>)}</select></label><button type="button" onClick={goNext} disabled={normalizedPage === lastIndex}>Trang sau →</button></nav>
    <p className="reader-context" aria-live="polite">{currentDefinition.title} · {physicalLabel} · {normalizedPage + 1}/{pages.length}</p>
    <p className="reader-hint">Kéo góc trang, dùng nút hoặc phím mũi tên, Page Up, Page Down, Home và End.</p>
  </main>
}
