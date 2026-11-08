import { useRef, useState, type KeyboardEvent } from 'react'
import type { HistoricalEvent } from '../../types/book'
import { usePageFlipBoundary } from './interaction'

export type AnimatedTimelineProps = { events: HistoricalEvent[]; isActive: boolean; selectedId?: string; defaultSelectedId?: string; onSelectionChange?: (id: string) => void }

export function AnimatedTimeline({ events, isActive, selectedId, defaultSelectedId, onSelectionChange }: AnimatedTimelineProps) {
  const boundaryRef = usePageFlipBoundary<HTMLOListElement>()
  const [internalId, setInternalId] = useState(defaultSelectedId ?? events[0]?.id)
  const activeId = selectedId ?? internalId
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const select = (id: string) => { if (selectedId === undefined) setInternalId(id); onSelectionChange?.(id) }
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!events.length || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? events.length - 1 : (index + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + events.length) % events.length
    select(events[next].id)
    buttons.current[next]?.focus()
  }
  const activeEvent = events.find((event) => event.id === activeId) ?? events[0]

  return <div className={`timeline-composition${isActive ? ' is-active' : ''}`}>
    <ol ref={boundaryRef} className="animated-timeline interactive-boundary" aria-label="Dòng thời gian">
      {events.map((event, index) => <li key={event.id}><button ref={(node) => { buttons.current[index] = node }} type="button" className={event.id === activeEvent?.id ? 'is-selected' : ''} aria-pressed={event.id === activeEvent?.id} tabIndex={event.id === activeEvent?.id ? 0 : -1} onClick={() => select(event.id)} onKeyDown={(keyEvent) => onKeyDown(keyEvent, index)}>{event.dateTime ? <time dateTime={event.dateTime}>{event.date}</time> : <span className="timeline-date">{event.date}</span>}<strong>{event.title}</strong></button></li>)}
    </ol>
    {activeEvent && <div className="timeline-detail" aria-live="polite"><strong>{activeEvent.title}</strong><p>{activeEvent.description}</p></div>}
  </div>
}
