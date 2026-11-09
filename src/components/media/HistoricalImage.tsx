import { useEffect, useRef, useState } from 'react'
import type { ImageAsset } from '../../types/book'
import { SourceCitation } from './SourceCitation'

export type HistoricalImageProps = { asset: ImageAsset; className?: string }

const MAX_RETRIES = 2

export function HistoricalImage({ asset, className }: HistoricalImageProps) {
  const pending = asset.status === 'pending-review' || !asset.src
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(pending ? 'loaded' : 'loading')
  const [attempt, setAttempt] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  // Ảnh lỗi tạm thời (server khởi động lại, mạng chập) không được biến thành lỗi vĩnh viễn.
  useEffect(() => {
    setStatus(pending ? 'loaded' : 'loading')
    setAttempt(0)
    return () => window.clearTimeout(timer.current)
  }, [asset.src, pending])

  const retry = () => {
    window.clearTimeout(timer.current)
    setStatus('loading')
    setAttempt((value) => value + 1)
  }

  const handleError = () => {
    if (attempt >= MAX_RETRIES) { setStatus('error'); return }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(retry, 300 * (attempt + 1))
  }

  // Lần thử lại thêm query để bỏ qua bản cache lỗi của trình duyệt.
  const src = asset.src && attempt > 0
    ? `${asset.src}${asset.src.includes('?') ? '&' : '?'}retry=${attempt}`
    : asset.src

  return (
    <figure className={`historical-image${className ? ` ${className}` : ''}`}>
      {pending ? <div className="pending-media" role="img" aria-label={asset.alt}><span>Tư liệu lưu trữ</span><strong>Đang chờ thẩm định</strong><small>{asset.requirements}</small></div> : <>
        {status === 'loading' && <span className="media-state" role="status">Đang tải hình ảnh…</span>}
        {status === 'error'
          ? <span className="media-state media-state--error" role="alert">
              Không thể tải hình ảnh.
              <button type="button" className="media-retry" onClick={retry}>Thử lại</button>
            </span>
          : <img
              key={attempt}
              ref={(node) => { if (node?.complete && node.naturalWidth > 0) setStatus('loaded') }}
              src={src} alt={asset.alt} loading="eager" decoding="async"
              className={status === 'loaded' ? 'is-loaded' : undefined}
              onLoad={() => setStatus('loaded')} onError={handleError} />}
      </>}
      <figcaption>{asset.caption}{asset.source && <SourceCitation source={asset.source} />}</figcaption>
    </figure>
  )
}
