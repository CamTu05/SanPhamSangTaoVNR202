import { useState } from 'react'
import type { ImageAsset } from '../../types/book'
import { SourceCitation } from './SourceCitation'

export type HistoricalImageProps = { asset: ImageAsset; className?: string }

export function HistoricalImage({ asset, className }: HistoricalImageProps) {
  const pending = asset.status === 'pending-review' || !asset.src
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(pending ? 'loaded' : 'loading')

  return (
    <figure className={`historical-image${className ? ` ${className}` : ''}`}>
      {pending ? <div className="pending-media" role="img" aria-label={asset.alt}><span>Tư liệu lưu trữ</span><strong>Đang chờ thẩm định</strong><small>{asset.requirements}</small></div> : <>
        {status === 'loading' && <span className="media-state" role="status">Đang tải hình ảnh…</span>}
        {status === 'error' ? <span className="media-state media-state--error" role="alert">Không thể tải hình ảnh.</span> : <img src={asset.src} alt={asset.alt} loading="lazy" decoding="async" onLoad={() => setStatus('loaded')} onError={() => setStatus('error')} />}
      </>}
      <figcaption>{asset.caption}{asset.source && <SourceCitation source={asset.source} />}</figcaption>
    </figure>
  )
}
