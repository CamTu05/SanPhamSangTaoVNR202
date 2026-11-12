import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { BookPageDefinition, ImageAsset, MediaAsset, VideoAsset } from '../../types/book'
import { bookDefinition, figureNumberByMediaId } from '../../data/bookPages'
import { mediaManifest } from '../../data/mediaManifest'
import { AnimatedTimeline } from '../media/AnimatedTimeline'
import { HistoricalImage } from '../media/HistoricalImage'
import { HistoricalInfoPopup } from '../media/HistoricalInfoPopup'
import { HistoricalVideo } from '../media/HistoricalVideo'
import { InteractiveMap } from '../media/InteractiveMap'
import { usePageFlipBoundary } from '../media/interaction'
import { SourceCitation } from '../media/SourceCitation'

export type LayoutProps = { page: BookPageDefinition; pageNumber: number; lastIndex: number; isActive: boolean; onNavigatePage?: (pageId: string) => void }

function Heading({ page }: { page: BookPageDefinition }) { return <>{page.eyebrow && <p className="chapter-label">{page.eyebrow}</p>}<h2>{page.title}</h2>{page.subtitle && <p className="page-subtitle">{page.subtitle}</p>}</> }
function Actions({ page, onNavigatePage }: Pick<LayoutProps, 'page' | 'onNavigatePage'>) { return page.actions?.length ? <div className="page-actions">{page.actions.map((action) => action.pageId ? <button key={action.label} type="button" onClick={() => onNavigatePage?.(action.pageId!)}>{action.label}</button> : <a key={action.label} href={action.url} target="_blank" rel="noreferrer">{action.label}</a>)}</div> : null }
function Sources({ page }: { page: BookPageDefinition }) { return page.sources?.length ? <div className="source-list">{page.sources.map((source) => <SourceCitation key={source.id ?? source.title} source={source} />)}</div> : null }
function sourceFrom(asset: MediaAsset) { return { title: asset.source, creator: asset.attribution, url: asset.sourceUrl, note: asset.license } }
function imageFrom(asset: MediaAsset): ImageAsset { const available = Boolean(asset.localPath); return { id: asset.id, kind: 'image', src: asset.localPath ?? undefined, alt: asset.description, caption: asset.caption ?? asset.description, figureNumber: figureNumberByMediaId.get(asset.id), source: sourceFrom(asset), status: available ? 'available' : 'pending-review', requirements: asset.kind === 'map' ? 'Bản đồ đang chờ kiểm chứng' : 'Tư liệu đang chờ cấp quyền' } }
function videoFrom(asset: MediaAsset): VideoAsset { return { id: asset.id, kind: 'video', src: asset.localPath ?? undefined, caption: asset.description, source: sourceFrom(asset), status: 'pending-review', requirements: `${asset.attribution} · ${asset.license}` } }
function Media({ page, isActive }: Pick<LayoutProps, 'page' | 'isActive'>) { const assets = mediaManifest.filter((asset) => page.mediaIds?.includes(asset.id) && (asset.displayPageId === page.id || (!asset.displayPageId && (asset.pageIds[0] === page.id || asset.kind === 'video' || page.layout === 'reference')))); return assets.length ? <div className="media-grid">{assets.map((asset) => asset.kind === 'video' ? <HistoricalVideo key={asset.id} asset={videoFrom(asset)} isActive={isActive} /> : <HistoricalImage key={asset.id} asset={imageFrom(asset)} />)}</div> : null }
function Cards({ page }: { page: BookPageDefinition }) { return page.cards?.length ? <div className="content-cards">{page.cards.map((item) => <HistoricalInfoPopup key={item.id} label={item.title} title={item.detailTitle ?? item.title} description={item.description} />)}</div> : null }
function Footer({ page, onNavigatePage }: Pick<LayoutProps, 'page' | 'onNavigatePage'>) { return <>{page.caption && <p className="page-caption">{page.caption}</p>}{page.highlight && <aside className="page-highlight">{page.highlight}</aside>}{page.tagline && <p className="page-tagline">{page.tagline}</p>}<Actions page={page} onNavigatePage={onNavigatePage} /><Sources page={page} /></> }
function Scroll({ children, variant = '' }: { children: ReactNode; variant?: string }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return
    const measure = () => {
      const available = frame.clientHeight
      const required = content.scrollHeight
      setScale(required > available ? available / required : 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(content)
    return () => observer.disconnect()
  }, [])
  return <div ref={frameRef} className="page-scroll"><div ref={contentRef} className={`page-layout page-layout__content ${variant}`} style={{ '--page-fit-scale': scale } as CSSProperties}>{children}</div></div>
}

export function CoverLayout({ page, pageNumber, isActive }: LayoutProps) { return <div className="cover-content"><p className="cover-kicker">{page.eyebrow}</p><div className="cover-emblem" aria-hidden="true">1945 · 1975</div><h2>{page.title}</h2><div className="cover-rule" /><p>{page.subtitle}</p>{page.tagline && <small>{page.tagline}</small>}{pageNumber === 0 && <Media page={page} isActive={isActive} />}</div> }
export function BackCoverLayout({ page }: LayoutProps) { return <div className="cover-content back-cover-content"><div className="cover-emblem" aria-hidden="true">✦</div><h2>{page.title}</h2><div className="cover-rule" /><p>{page.subtitle}</p><small>{page.tagline}</small></div> }
export function StandardLayout(props: LayoutProps) { const { page, isActive, onNavigatePage } = props; if (page.id === 'ending-reflection') return <Scroll variant="layout-ending-reflection"><Heading page={page} /><div className="ending-reflection__body">{page.body?.split('\n\n').map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><Media page={page} isActive={isActive} />{page.highlight && <p className="ending-reflection__highlight">{page.highlight}</p>}{page.tagline && <p className="ending-reflection__final">{page.tagline}</p>}</Scroll>; if (page.id === 'c4-geneva') return <Scroll variant="layout-geneva-split"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<div className="geneva-split"><Cards page={page} /><Media page={page} isActive={isActive} /></div><Footer page={page} onNavigatePage={onNavigatePage} /></Scroll>; if (page.id === 'ending-media-guide') return <Scroll variant="layout-media-guide"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<div className="media-guide__types"><section><h3>Ảnh lưu trữ</h3><p>Ghi lại con người hoặc sự kiện trong một thời điểm cụ thể; cần đọc cùng tác giả, ngày chụp và nơi lưu trữ.</p></section><section><h3>Minh họa tái dựng</h3><p>Hỗ trợ diễn giải nội dung nhưng không thay thế bằng chứng ảnh chụp tại sự kiện.</p></section><section><h3>Sơ đồ khái niệm</h3><p>Tóm lược không gian hoặc tiến trình để học tập; không phải bản đồ tác chiến nguyên gốc.</p></section></div><Sources page={page} /></Scroll>; if (page.id === 'c4-phase-two') return <Scroll variant="layout-dien-bien-victory"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<Media page={page} isActive={isActive} />{page.tagline && <p className="dien-bien-victory__conclusion">{page.tagline}</p>}</Scroll>; if (page.id === 'c3-international-1950') return <Scroll variant="layout-international-context"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<InternationalContextCards page={page} /><Media page={page} isActive={isActive} /></Scroll>; if (page.id === 'c2-viet-bac') return <Scroll variant="layout-bases-forces-editorial"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<Media page={page} isActive={isActive} /><div className="bases-forces-editorial__sections">{page.editorialSections?.map(section => <section key={section.title}><h3>{section.title}</h3><p>{section.body}</p></section>)}</div></Scroll>; if (page.id === 'c2-bases-forces') return <Scroll variant="layout-bases-forces-editorial"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<Media page={page} isActive={isActive} /><div className="bases-forces-editorial__sections">{page.editorialSections?.map(section => <section key={section.title}><h3>{section.title}</h3><p>{section.body}</p></section>)}</div>{page.tagline && <p className="bases-forces-editorial__conclusion">{page.tagline}</p>}</Scroll>; if (page.id === 'c2-viet-bac') return <Scroll variant="layout-viet-bac-editorial"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<div className="viet-bac-editorial__boxes">{page.cards?.map(card => <section key={card.id}><h3>{card.title}</h3><p>{card.description}</p></section>)}</div>{page.tagline && <p className="viet-bac-editorial__conclusion">{page.tagline}</p>}</Scroll>; if (page.id === 'c1-challenges') { const sections = page.editorialSections ?? []; return <Scroll variant="layout-challenges-editorial"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<div className="challenges-editorial__feature"><Media page={page} isActive={isActive} /><div className="challenges-editorial__side">{sections.slice(0,2).map(section => <section key={section.title}><h3>{section.title}</h3><p>{section.body}</p></section>)}</div></div>{sections[2] && <section className="challenges-editorial__institution"><h3>{sections[2].title}</h3><p>{sections[2].body}</p></section>}{page.tagline && <p className="challenges-editorial__conclusion">{page.tagline}</p>}</Scroll> } if (page.id === 'c1-declaration') return <Scroll variant="layout-declaration"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<p className="declaration-arguments__instruction">Chọn một luận điểm để khám phá chi tiết.</p><div className="declaration-explorer"><DeclarationArguments page={page} /><Media page={page} isActive={isActive} /></div>{isActive && <DeclarationAudio />}</Scroll>; if (page.id === 'opening-title') return <Scroll variant="layout-opening-statement"><div className="opening-statement__heading"><p className="chapter-label">MỞ ĐẦU</p><h2>{page.title}</h2><p className="opening-statement__period">Việt Nam 1945–1975</p></div><p className="opening-statement__intro">{page.body}</p><div className="opening-statement__timeline" aria-label="Các dấu mốc 1945, 1954, 1968, 1973 và 1975">{['1945','1954','1968','1973','1975'].map(year => <span key={year}>{year}</span>)}</div><p className="opening-statement__support">Từ mùa thu 1945 đến mùa xuân 1975, hành trình này mở ra những dấu mốc quan trọng của lịch sử Việt Nam hiện đại.</p></Scroll>; return <Scroll variant={`layout-${page.layout} page-${page.id}`}><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<Cards page={page} />{page.microcopy && <p className="microcopy">{page.microcopy}</p>}<Media page={page} isActive={isActive} /><Footer page={page} onNavigatePage={onNavigatePage} /></Scroll> }
export function ComparisonLayout({ page, isActive, onNavigatePage }: LayoutProps) { return <Scroll variant={`layout-comparison page-${page.id}`}><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<Cards page={page} /><Media page={page} isActive={isActive} /><Footer page={page} onNavigatePage={onNavigatePage} /></Scroll> }
function InternationalContextCards({ page }: Pick<LayoutProps, 'page'>) {
  const [selectedId, setSelectedId] = useState<string>()
  const boundaryRef = usePageFlipBoundary<HTMLDivElement>()
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const selected = page.cards?.find(item => item.id === selectedId)
  const close = useCallback(() => {
    const trigger = selectedId ? triggerRefs.current[selectedId] : null
    setSelectedId(undefined)
    requestAnimationFrame(() => trigger?.focus())
  }, [selectedId])
  useEffect(() => {
    if (!selected) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (['ArrowLeft','ArrowRight','PageUp','PageDown','Home','End'].includes(event.key)) event.stopPropagation()
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return }
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown, true) }
  }, [close, selected])
  return <><div ref={boundaryRef} className="international-context-cards interactive-boundary" role="group" aria-label="Bối cảnh quốc tế năm 1950">{page.cards?.map((item, index) => <button ref={(node) => { triggerRefs.current[item.id] = node }} key={item.id} type="button" aria-haspopup="dialog" aria-expanded={selectedId === item.id} onClick={() => setSelectedId(item.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong></button>)}</div>{selected && createPortal(<div className="international-context-modal__backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><div ref={dialogRef} className="international-context-modal" role="dialog" aria-modal="true" aria-labelledby="international-context-modal-title"><button ref={closeRef} className="international-context-modal__close" type="button" aria-label="Đóng hộp thoại" onClick={close}>×</button><p className="international-context-modal__eyebrow">{selected.title}</p><h2 id="international-context-modal-title">{selected.detailTitle ?? selected.title}</h2><p>{selected.description}</p></div></div>, document.body)}</>
}

function DeclarationAudio() {
  const boundaryRef = usePageFlipBoundary<HTMLDivElement>()
  return <div ref={boundaryRef} className="declaration-audio interactive-boundary"><p className="declaration-audio__label">Toàn văn Bác Hồ đọc Tuyên ngôn Độc lập</p><iframe src="https://audioaz.com/vi/embed/audiobook/toan-van-bac-ho-doc-tuyen-ngon-doc-lap" width="100%" height="180" title="Toàn Văn Bác Hồ Đọc Tuyên Ngôn Độc Lập | AudioAZ" allow="autoplay; encrypted-media" loading="lazy" /></div>
}

function DeclarationArguments({ page }: Pick<LayoutProps, 'page'>) {
  const [selectedId, setSelectedId] = useState<string>()
  const boundaryRef = usePageFlipBoundary<HTMLDivElement>()
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const selected = page.cards?.find(item => item.id === selectedId)
  const close = useCallback(() => {
    const trigger = selectedId ? triggerRefs.current[selectedId] : null
    setSelectedId(undefined)
    requestAnimationFrame(() => trigger?.focus())
  }, [selectedId])
  useEffect(() => {
    if (!selected) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (['ArrowLeft','ArrowRight','PageUp','PageDown','Home','End'].includes(event.key)) event.stopPropagation()
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return }
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown, true) }
  }, [close, selected])
  const modal = selected ? createPortal(<div className="declaration-modal__backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><div ref={dialogRef} className="declaration-modal" role="dialog" aria-modal="true" aria-labelledby="declaration-modal-title"><button ref={closeRef} className="declaration-modal__close" type="button" aria-label="Đóng hộp thoại" onClick={close}>×</button><p className="declaration-modal__eyebrow">{selected.title}</p><h2 id="declaration-modal-title">{selected.detailTitle}</h2><div className="declaration-modal__content"><section><h3>Nội dung</h3>{selected.description.split('\n\n').map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>{selected.significance && <section><h3>Ý nghĩa</h3><p>{selected.significance}</p></section>}</div></div></div>, document.body) : null
  return <><div ref={boundaryRef} className="declaration-arguments interactive-boundary"><div className="declaration-arguments__buttons" role="group" aria-label="Các luận điểm của Tuyên ngôn Độc lập">{page.cards?.map((item, index) => <button ref={(node) => { triggerRefs.current[item.id] = node }} key={item.id} type="button" aria-haspopup="dialog" aria-expanded={selectedId === item.id} onClick={() => setSelectedId(item.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong></button>)}</div></div>{modal}</>
}

function OpeningContextTimeline({ page }: Pick<LayoutProps, 'page'>) {
  const [selectedId, setSelectedId] = useState<string>()
  const boundaryRef = usePageFlipBoundary<HTMLDivElement>()
  const selected = page.events?.find(event => event.id === selectedId)
  return <div ref={boundaryRef} className="opening-context-timeline interactive-boundary"><p className="opening-context-timeline__instruction">Chọn một ô thời gian để khám phá diễn biến và ý nghĩa lịch sử.</p><div className="opening-context-timeline__buttons" role="group" aria-label="Các biến cố trước mùa thu 1945">{page.events?.map(event => <button key={event.id} type="button" className={selectedId === event.id ? 'is-selected' : ''} aria-pressed={selectedId === event.id} onClick={() => setSelectedId(current => current === event.id ? undefined : event.id)}><span>{event.date}</span><strong>{event.id === 'o1' ? 'Nhật đảo chính Pháp' : 'Nhật đầu hàng Đồng minh'}</strong></button>)}</div>{selected && <article className="opening-context-timeline__detail" aria-live="polite"><button className="opening-context-timeline__close" type="button" aria-label="Đóng chi tiết" onClick={() => setSelectedId(undefined)}>×</button><time>{selected.date}</time><h3>{selected.title}</h3><div className="opening-context-timeline__sections">{selected.context && <section><h4>Bối cảnh</h4><p>{selected.context}</p></section>}<section><h4>Diễn biến</h4><p>{selected.description}</p></section>{selected.significance && <section><h4>Ý nghĩa</h4><p>{selected.significance}</p></section>}</div></article>}</div>
}

function AugustRevolutionTimeline({ page }: Pick<LayoutProps, 'page'>) {
  const [selectedId, setSelectedId] = useState<string>()
  const boundaryRef = usePageFlipBoundary<HTMLDivElement>()
  const selected = page.events?.find(event => event.id === selectedId)
  const labels: Record<string, string> = { a1:'Hà Nội', a2:'Huế', a3:'Sài Gòn', a4:'Thoái vị' }
  return <div ref={boundaryRef} className="august-timeline interactive-boundary"><p className="august-timeline__instruction">Chọn một mốc thời gian để khám phá diễn biến lịch sử.</p><div className="august-timeline__buttons" role="group" aria-label="Các mốc Cách mạng tháng Tám">{page.events?.map(event => <button key={event.id} type="button" className={selectedId === event.id ? 'is-selected' : ''} aria-pressed={selectedId === event.id} onClick={() => setSelectedId(current => current === event.id ? undefined : event.id)}><span>{event.date}</span><strong>{labels[event.id]}</strong></button>)}</div>{selected ? <article className="august-timeline__detail" aria-live="polite"><button className="august-timeline__close" type="button" aria-label="Đóng chi tiết" onClick={() => setSelectedId(undefined)}>×</button><time>{selected.date}</time><h3>{selected.title}</h3><p>{selected.description}</p>{selected.significance && <p className="august-timeline__significance"><strong>Ý nghĩa:</strong> {selected.significance}</p>}</article> : <p className="august-timeline__invitation">Chạm vào một mốc để xem diễn biến và ý nghĩa.</p>}</div>
}

export function TimelineLayout({ page, isActive, onNavigatePage }: LayoutProps) {
  const [selectedId, setSelectedId] = useState(page.events?.[0]?.id)
  const composition = page.interaction?.kind === 'timeline-map-sync'
  if (page.id === 'c4-phase-one') return <Scroll variant="layout-dien-bien-phases"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<ol className="dien-bien-phases">{page.events?.map(event => <li key={event.id}><time>{event.date}</time><h3>{event.title}</h3><p>{event.description}</p></li>)}</ol></Scroll>
  if (page.id === 'opening-context') return <Scroll variant="layout-opening-context"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<Media page={page} isActive={isActive} /><OpeningContextTimeline page={page} /></Scroll>
  if (page.id === 'c1-august-revolution') return <Scroll variant="layout-august-revolution"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<AugustRevolutionTimeline page={page} /></Scroll>
  const assetRecord = composition ? mediaManifest.find((asset) => page.mediaIds?.includes(asset.id) && asset.kind !== 'video') : undefined
  const labels = page.interaction ?? { title: '', description: '', label: '' }
  return <Scroll variant={`layout-timeline${composition ? ' layout-timeline-composed' : ''} page-${page.id}`}><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}{page.events?.length ? composition ? <div className="controlled-timeline"><AnimatedTimeline events={page.events} isActive={isActive} selectedId={selectedId} onSelectionChange={setSelectedId} /><InteractiveMap asset={assetRecord ? imageFrom(assetRecord) : undefined} hotspots={[]} phases={page.events} selectedPhaseId={selectedId} onPhaseChange={setSelectedId} showSchematic={false} {...labels} /></div> : <AnimatedTimeline events={page.events} isActive={isActive} /> : <p className="empty-state">Dòng thời gian đang cập nhật.</p>}<Cards page={page} />{!composition && <Media page={page} isActive={isActive} />}<Footer page={page} onNavigatePage={onNavigatePage} /></Scroll>
}
export function StrategyLayout({ page, isActive, onNavigatePage }: LayoutProps) { const [selected, setSelected] = useState(page.cards?.[0]?.id); const tabs = useRef<Array<HTMLButtonElement | null>>([]); const baseId = useId(); const active = page.cards?.find((item) => item.id === selected); const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => { const cards = page.cards ?? []; if (!cards.length || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : (index + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + cards.length) % cards.length; setSelected(cards[next].id); tabs.current[next]?.focus() }; return <Scroll variant={`layout-strategy-tabs page-${page.id}`}><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<div className="strategy-tabs" role="tablist">{page.cards?.map((item, index) => <button ref={(node) => { tabs.current[index] = node }} id={`${baseId}-tab-${index}`} key={item.id} type="button" role="tab" aria-selected={item.id === selected} aria-controls={`${baseId}-panel-${index}`} tabIndex={item.id === selected ? 0 : -1} onClick={() => setSelected(item.id)} onKeyDown={(event) => navigate(event, index)}>{item.title}</button>)}</div>{active && <article id={`${baseId}-panel-${page.cards?.indexOf(active)}`} role="tabpanel" aria-labelledby={`${baseId}-tab-${page.cards?.indexOf(active)}`} className="strategy-panel"><h3>{active.detailTitle ?? active.title}</h3><p>{active.description}</p></article>}<Media page={page} isActive={isActive} /><Footer page={page} onNavigatePage={onNavigatePage} /></Scroll> }
export function TocLayout({ page, onNavigatePage }: LayoutProps) { const boundaryRef = usePageFlipBoundary<HTMLDivElement>(); return <Scroll variant="layout-toc"><Heading page={page} />{page.body && <p className="page-body">{page.body}</p>}<div ref={boundaryRef} className="toc-links interactive-boundary">{page.actions?.map((action, index) => { const targetIndex = bookDefinition.pages.findIndex(item => item.id === action.pageId); const title = action.label.replace(/^C\d+\s*·\s*/, '').replace(/^Kết sách$/, 'Kết sách'); return <button key={action.pageId} type="button" onClick={() => onNavigatePage?.(action.pageId!)}><span className="toc-entry__label">{index < 9 ? `Chương ${index + 1} - ${title}` : title}</span><span className="toc-entry__leader" aria-hidden="true" /><span className="toc-entry__page">{targetIndex > 0 ? String(targetIndex).padStart(2, '0') : '—'}</span></button> })}</div></Scroll> }
