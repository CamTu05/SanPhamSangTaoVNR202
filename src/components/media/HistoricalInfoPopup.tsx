import { useEffect, useId, useRef, useState } from 'react'
import type { HistoricalSource } from '../../types/book'
import { usePageFlipBoundary } from './interaction'
import { SourceCitation } from './SourceCitation'

export type HistoricalInfoPopupProps = { label: string; title: string; description: string; source?: HistoricalSource; open?: boolean; onOpenChange?: (open: boolean) => void }

export function HistoricalInfoPopup({ label, title, description, source, open: controlledOpen, onOpenChange }: HistoricalInfoPopupProps) {
  const boundaryRef = usePageFlipBoundary<HTMLSpanElement>()
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const panelId = useId()
  const titleId = useId()
  const descriptionId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const setOpen = (value: boolean) => { if (controlledOpen === undefined) setInternalOpen(value); onOpenChange?.(value) }

  useEffect(() => { if (open) closeRef.current?.focus() }, [open])
  const close = (restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus())
  }

  // Đóng khi bấm ra ngoài hoặc nhấn Escape ở bất cứ đâu trên trang.
  useEffect(() => {
    if (!open) return
    const onClick = (event: MouseEvent) => {
      if (!boundaryRef.current?.contains(event.target as Node)) close(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopPropagation(); close() }
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey, true)
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey, true) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, controlledOpen])

  return <span ref={boundaryRef} className="info-popup interactive-boundary">
    <button ref={triggerRef} type="button" aria-expanded={open} aria-controls={panelId} aria-haspopup="dialog" onClick={() => setOpen(!open)}>{label}</button>
    {open && <span id={panelId} className="info-popup__panel" role="region" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <strong id={titleId}>{title}</strong><span id={descriptionId}>{description}</span>{source && <SourceCitation source={source} />}<button ref={closeRef} type="button" onClick={() => close()}>Đóng</button>
    </span>}
  </span>
}
