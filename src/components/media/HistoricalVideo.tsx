import { useEffect, useRef, useState } from 'react'
import type { VideoAsset } from '../../types/book'
import { usePageFlipBoundary } from './interaction'
import { SourceCitation } from './SourceCitation'

export type HistoricalVideoProps = { asset: VideoAsset; isActive: boolean }

export function HistoricalVideo({ asset, isActive }: HistoricalVideoProps) {
  const boundaryRef = usePageFlipBoundary<HTMLElement>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const pending = asset.status === 'pending-review' || !asset.src
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(pending ? 'ready' : 'loading')

  useEffect(() => {
    const video = videoRef.current
    video?.pause()
    video?.load()
    return () => { video?.pause(); if (video) { video.removeAttribute('src'); video.load() } }
  }, [asset.src, pending])

  useEffect(() => {
    const video = videoRef.current
    if (!isActive) video?.pause()
    return () => video?.pause()
  }, [isActive])

  return (
    <figure ref={boundaryRef} className="historical-video interactive-boundary">
      {pending ? <div className="pending-media pending-media--video" role="img" aria-label={asset.caption}><strong>Tư liệu video đang cập nhật</strong><small>{asset.requirements}</small></div> : <>
        {status === 'loading' && <span className="media-state" role="status">Đang tải video…</span>}
        {status === 'error' && <span className="media-state media-state--error" role="alert">Không thể tải video.</span>}
        <video ref={videoRef} controls preload="metadata" poster={asset.poster} aria-label={asset.caption} onLoadedMetadata={() => setStatus('ready')} onError={() => setStatus('error')}>
          <source src={asset.src} type="video/mp4" />
          {asset.tracks?.map((track) => <track key={`${track.kind}-${track.srcLang}`} {...track} />)}
          Trình duyệt của bạn không hỗ trợ video HTML5.
        </video>
      </>}
      <figcaption>{asset.caption}{asset.source && <SourceCitation source={asset.source} />}</figcaption>
      {asset.transcript && <details className="transcript"><summary>Bản chép lời</summary><p>{asset.transcript}</p></details>}
    </figure>
  )
}
