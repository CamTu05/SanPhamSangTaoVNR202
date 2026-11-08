import type { HistoricalSource } from '../../types/book'

export function SourceCitation({ source }: { source: HistoricalSource }) {
  const text = [source.creator, source.title, source.publisher, source.date].filter(Boolean).join(', ')
  return <small className="source-citation">Nguồn: {source.url ? <a href={source.url} target="_blank" rel="noreferrer">{text}<span className="visually-hidden"> (mở trong thẻ mới)</span></a> : text}{source.note ? ` · ${source.note}` : ''}</small>
}
