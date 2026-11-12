import { useEffect, useRef, useState } from 'react'

const VIDEO_ID = 'KdW-JHLHpQQ'
const START_VOLUME = 5
const TARGET_VOLUME = 70
const FADE_DURATION = 10_000

type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'
type YouTubePlayer = {
  playVideo: () => void
  pauseVideo: () => void
  setVolume: (volume: number) => void
  destroy: () => void
}
type YouTubePlayerEvent = { data: number }
type YouTubeNamespace = {
  Player: new (element: HTMLElement, options: {
    videoId: string
    playerVars: Record<string, number | string>
    events: {
      onReady: () => void
      onStateChange: (event: YouTubePlayerEvent) => void
      onError: () => void
    }
  }) => YouTubePlayer
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number }
}

declare global {
  interface Window {
    YT?: YouTubeNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YouTubeNamespace> | undefined

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.()
      if (window.YT) resolve(window.YT)
      else reject(new Error('YouTube API unavailable'))
    }
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]')
    if (existing) return
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.onerror = () => reject(new Error('Unable to load YouTube API'))
    document.head.appendChild(script)
  })
  return apiPromise
}

export function BackgroundAudio() {
  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | undefined>(undefined)
  const fadeRef = useRef<number | undefined>(undefined)
  const startedAtRef = useRef(0)
  const [state, setState] = useState<PlayerState>('idle')

  const stopFade = () => {
    if (fadeRef.current !== undefined) window.clearInterval(fadeRef.current)
    fadeRef.current = undefined
  }

  const startFade = () => {
    stopFade()
    const player = playerRef.current
    if (!player) return
    startedAtRef.current = performance.now()
    player.setVolume(START_VOLUME)
    fadeRef.current = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAtRef.current) / FADE_DURATION)
      player.setVolume(Math.round(START_VOLUME + (TARGET_VOLUME - START_VOLUME) * progress))
      if (progress === 1) stopFade()
    }, 200)
  }

  const createPlayer = async () => {
    if (playerRef.current || !hostRef.current) return playerRef.current
    setState('loading')
    try {
      const YT = await loadYouTubeApi()
      return await new Promise<YouTubePlayer>((resolve) => {
        const player = new YT.Player(hostRef.current!, {
          videoId: VIDEO_ID,
          playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, loop: 1, playlist: VIDEO_ID, playsinline: 1, rel: 0 },
          events: {
            onReady: () => { playerRef.current = player; player.setVolume(START_VOLUME); setState('paused'); resolve(player) },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) setState('playing')
              if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) { stopFade(); setState('paused') }
            },
            onError: () => { stopFade(); setState('error') }
          }
        })
      })
    } catch {
      setState('error')
      return undefined
    }
  }

  const toggle = async () => {
    if (state === 'playing') {
      stopFade()
      playerRef.current?.pauseVideo()
      return
    }
    const player = await createPlayer()
    if (!player) return
    player.playVideo()
    startFade()
  }

  useEffect(() => () => {
    stopFade()
    playerRef.current?.destroy()
  }, [])

  const playing = state === 'playing'
  const label = state === 'loading' ? 'Đang tải âm thanh' : state === 'error' ? 'Không thể tải âm thanh' : playing ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'

  return <div className="background-audio">
    <div ref={hostRef} className="background-audio__player" aria-hidden="true" />
    <button type="button" className={`background-audio__toggle${playing ? ' is-playing' : ''}`} aria-label={label} title={label} aria-pressed={playing} disabled={state === 'loading'} onClick={toggle}>
      {playing ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="M18 9.5a4 4 0 0 1 0 5M20.5 7a7.5 7.5 0 0 1 0 10"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="m18 9 4 4m0-4-4 4"/></svg>}
    </button>
  </div>
}
