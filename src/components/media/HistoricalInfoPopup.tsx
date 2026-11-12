import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { HistoricalSource } from '../../types/book'
import { usePageFlipBoundary } from './interaction'
import { SourceCitation } from './SourceCitation'

export type HistoricalInfoPopupProps = { label: string; title: string; description: string; source?: HistoricalSource; open?: boolean; onOpenChange?: (open: boolean) => void }

export function HistoricalInfoPopup({ label, title, description, source, open: controlledOpen, onOpenChange }: HistoricalInfoPopupProps) {
  const boundaryRef = usePageFlipBoundary<HTMLSpanElement>()
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const titleId = useId()
  const descriptionId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const setOpen = useCallback((value: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(value)
    onOpenChange?.(value)
  }, [controlledOpen, onOpenChange])
  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus())
  }, [setOpen])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowLeft','ArrowRight','PageUp','PageDown','Home','End'].includes(event.key)) event.stopPropagation()
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return }
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button,a[href],[tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [close, open])

  const modal = open ? createPortal(
    <div className="info-dialog__backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <div ref={dialogRef} className="info-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
        <button ref={closeRef} type="button" className="info-dialog__close" aria-label="Đóng nội dung" onClick={() => close()}>×</button>
        <p className="info-dialog__eyebrow">{label}</p>
        <h2 id={titleId}>{title}</h2>
        <div id={descriptionId} className="info-dialog__content">{description.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        {source && <SourceCitation source={source} />}
      </div>
    </div>,
    document.body
  ) : null

  return <>
    <span ref={boundaryRef} className="info-popup interactive-boundary">
      <button ref={triggerRef} type="button" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(!open)}>{label}</button>
    </span>
    {modal}
  </>
}
