import { useId, useRef, useState, type KeyboardEvent } from 'react'
import type { CampaignPhase, ImageAsset, InteractiveHotspot } from '../../types/book'
import { HistoricalImage } from './HistoricalImage'
import { HistoricalInfoPopup } from './HistoricalInfoPopup'
import { usePageFlipBoundary } from './interaction'

export type InteractiveMapProps = { asset?: ImageAsset; hotspots: InteractiveHotspot[]; phases?: CampaignPhase[]; selectedPhaseId?: string; onPhaseChange?: (id: string) => void; title?: string; description?: string; label?: string }

export function InteractiveMap({ asset, hotspots, phases = [], selectedPhaseId, onPhaseChange, title = 'Các giai đoạn của chiến dịch', description = 'Các dải thời gian nối tiếp, không thể hiện vị trí địa lý hay tuyến hành quân.', label = 'Sơ đồ chiến dịch tương tác' }: InteractiveMapProps) {
  const boundaryRef = usePageFlipBoundary<HTMLDivElement>()
  const baseId = useId()
  const [internalId, setInternalId] = useState(phases[0]?.id)
  const activeId = selectedPhaseId ?? internalId
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const select = (id: string) => { if (selectedPhaseId === undefined) setInternalId(id); onPhaseChange?.(id) }
  const keyNavigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!phases.length || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? phases.length - 1 : (index + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + phases.length) % phases.length
    select(phases[next].id); buttons.current[next]?.focus()
  }
  const active = phases.find((phase) => phase.id === activeId) ?? phases[0]

  const isInteractive = phases.length > 0 || hotspots.length > 0

  return <div ref={boundaryRef} className="interactive-map interactive-boundary" aria-label={isInteractive ? label : undefined}>
    {phases.length > 0 && <div className="phase-schematic"><p>{label}</p><svg viewBox="0 0 360 82" role="img" aria-labelledby={`${baseId}-title ${baseId}-desc`}><title id={`${baseId}-title`}>{title}</title><desc id={`${baseId}-desc`}>{description}</desc>{phases.map((phase, index) => <g key={phase.id}><rect x={8 + index * 119} y="18" width="106" height="44" rx="4" className={phase.id === active?.id ? 'is-selected' : ''} /><text x={61 + index * 119} y="45" textAnchor="middle">Giai đoạn {index + 1}</text></g>)}</svg><div className="phase-controls" role="group" aria-label={`Chọn ${label.toLocaleLowerCase('vi')}`}>{phases.map((phase, index) => <button ref={(node) => { buttons.current[index] = node }} key={phase.id} type="button" aria-pressed={phase.id === active?.id} tabIndex={phase.id === active?.id ? 0 : -1} onClick={() => select(phase.id)} onKeyDown={(event) => keyNavigate(event, index)}>{phase.date}</button>)}</div>{active && <div className="phase-detail" aria-live="polite"><strong>{active.title}</strong><p>{active.description}</p></div>}</div>}
    {asset && <HistoricalImage asset={asset} />}
    {hotspots.map((hotspot) => <span key={hotspot.id} className="map-hotspot" style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}><HistoricalInfoPopup {...hotspot} /></span>)}
  </div>
}
