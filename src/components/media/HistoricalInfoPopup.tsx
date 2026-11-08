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
  const close = () => { setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus()) }

  return <span ref={boundaryRef} className="info-popup interactive-boundary" onKeyDown={(event) => { if (event.key === 'Escape' && open) { event.stopPropagation(); close() } }}>
    <button ref={triggerRef} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>{label}</button>
    {open && <span id={panelId} className="info-popup__panel" role="region" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <strong id={titleId}>{title}</strong><span id={descriptionId}>{description}</span>{source && <SourceCitation source={source} />}<button ref={closeRef} type="button" onClick={close}>Đóng</button>
    </span>}
  </span>
}
