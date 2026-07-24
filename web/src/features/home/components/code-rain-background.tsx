/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useEffect, useRef } from 'react'

/**
 * Matrix-style code rain background rendered on a transparent canvas.
 * Sits behind hero content and works with both light and dark themes —
 * characters are drawn in the theme's info/accent tone over the existing
 * hero surface color. Respects prefers-reduced-motion (static frame).
 */
export function CodeRainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const parent = canvas.parentElement
    if (!parent) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const fontSize = 14
    const lineHeight = fontSize + 3
    const colWidth = fontSize + 4
    const trailLength = 7

    // API-gateway themed tokens: protocols, status codes, billing terms
    const tokens = [
      '{', '}', '(', ')', '[', ']', '=>', ';;', '::',
      'const', 'let', 'fn', 'return', 'async', 'await',
      'import', 'export', 'null', 'true', 'false',
      'POST', 'GET', 'PUT', 'DELETE', 'PATCH',
      '/v1/chat', '/v1/resp', '/v1/msg', '/v1/emb',
      '200', '201', '400', '401', '429', '500',
      'token', 'usage', 'quota', 'model', 'ratio',
      'stream', 'sse', 'json', 'curl', 'auth',
      'ai', 'llm', 'gpt', 'api', 'key',
    ]
    const charset = tokens.flatMap((t) => t.split(''))
    const monoFont =
      '14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

    interface Column {
      y: number
      speed: number
      chars: string[]
    }

    let width = 0
    let height = 0
    let columns: Column[] = []

    function randomChar() {
      return charset[Math.floor(Math.random() * charset.length)]
    }

    // Canvas 2D cannot resolve CSS var() — read the computed theme color via
    // a throwaway element so oklch() values come back as canvas-safe rgb().
    let fgColor = '#1a1a1a'
    function readFgColor() {
      const probe = document.createElement('span')
      probe.style.color = 'var(--foreground)'
      probe.style.display = 'none'
      document.body.appendChild(probe)
      fgColor = getComputedStyle(probe).color || '#1a1a1a'
      document.body.removeChild(probe)
    }
    readFgColor()

    // Re-read when the theme class on <html> toggles (light/dark switch)
    const themeObserver = new MutationObserver(readFgColor)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    function resize() {
      if (!parent || !canvas || !ctx) return
      width = parent.clientWidth
      height = parent.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.ceil(width / colWidth)
      columns = Array.from({ length: count }, () => ({
        y: Math.random() * -height,
        speed: 0.6 + Math.random() * 0.9,
        chars: Array.from({ length: trailLength }, randomChar),
      }))
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      ctx.font = monoFont
      ctx.textBaseline = 'top'

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i]
        const x = i * colWidth

        for (let j = 0; j < trailLength; j++) {
          const y = col.y - j * lineHeight
          if (y < -lineHeight || y > height + lineHeight) continue

          // Occasionally mutate a trail character for a "live" feel
          if (Math.random() < 0.02) {
            col.chars[j] = randomChar()
          }

          if (j === 0) {
            // Head character — bright
            ctx.fillStyle = fgColor
            ctx.globalAlpha = 0.85
          } else {
            ctx.fillStyle = fgColor
            ctx.globalAlpha = (1 - j / trailLength) * 0.3
          }
          ctx.fillText(col.chars[j], x, y)
        }
        ctx.globalAlpha = 1

        col.y += col.speed * 1.6
        if (col.y - trailLength * lineHeight > height + 20) {
          col.y = Math.random() * -height * 0.5
          col.speed = 0.6 + Math.random() * 0.9
        }
      }
    }

    let raf = 0
    let running = false

    function loop() {
      if (!running) return
      draw()
      raf = requestAnimationFrame(loop)
    }

    function start() {
      if (running || reduced) return
      running = true
      raf = requestAnimationFrame(loop)
    }

    function stop() {
      running = false
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    if (reduced) {
      draw()
    } else {
      start()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        entry.isIntersecting ? start() : stop()
      },
      { threshold: 0 }
    )
    io.observe(parent)

    const onVisibility = () => {
      document.hidden ? stop() : start()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 z-0 h-full w-full'
    />
  )
}
