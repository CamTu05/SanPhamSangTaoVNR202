import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { HistoricalSource } from '../types/book'
import { SourceCitation } from './media/SourceCitation'

type SourcesDialogProps = { open: boolean; sources: HistoricalSource[]; onClose: () => void; triggerRef: React.RefObject<HTMLButtonElement | null> }

export function SourcesDialog({ open, sources, onClose, triggerRef }: SourcesDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => {
    onClose()
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [onClose, triggerRef])

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

  if (!open) return null
  return createPortal(
    <div className="sources-dialog__backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <div ref={dialogRef} className="sources-dialog" role="dialog" aria-modal="true" aria-labelledby="sources-dialog-title">
        <button ref={closeRef} className="sources-dialog__close" type="button" aria-label="Đóng nguồn tư liệu" onClick={close}>×</button>
        <p className="sources-dialog__eyebrow">HỒ SƠ BIÊN TẬP</p>
        <h2 id="sources-dialog-title">Nguồn tư liệu</h2>
        <p className="sources-dialog__intro">Danh mục nguồn lịch sử đang được sử dụng trong ebook. Nguồn ảnh và tình trạng quyền được ghi trực tiếp dưới từng hình.</p>
        <div className="sources-dialog__list">{sources.map((source) => <SourceCitation key={source.id ?? source.title} source={source} />)}</div>
      </div>
    </div>,
    document.body
  )
}
