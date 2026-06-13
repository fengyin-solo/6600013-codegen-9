import type { MirrorMode } from '../types'

// Seeded PRNG (mulberry32)
export function createRng(seed: number) {
  let s = seed | 0
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Rng = ReturnType<typeof createRng>

export function generateSpiral(
  w: number, h: number, iterations: number, scale: number,
  palette: string[], rng: Rng, strokeWidth: number, opacity: number
): string {
  const cx = w / 2, cy = h / 2
  let paths = ''
  const arms = 3 + Math.floor(rng() * 5)
  for (let arm = 0; arm < arms; arm++) {
    const offset = (arm / arms) * Math.PI * 2
    let d = ''
    for (let i = 0; i < iterations; i++) {
      const angle = (i / iterations) * Math.PI * 8 + offset
      const r = (i / iterations) * Math.min(w, h) * 0.45 * scale
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1)
    }
    const color = palette[arm % palette.length]
    paths += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`
  }
  return paths
}

export function generateFractal(
  w: number, h: number, iterations: number, scale: number,
  palette: string[], rng: Rng, strokeWidth: number, opacity: number
): string {
  let paths = ''
  const depth = Math.min(8, Math.floor(iterations / 25) + 2)
  function tree(x: number, y: number, angle: number, len: number, d: number) {
    if (d <= 0 || len < 2) return
    const x2 = x + Math.cos(angle) * len
    const y2 = y + Math.sin(angle) * len
    const color = palette[d % palette.length]
    paths += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`
    const spread = 0.4 + rng() * 0.3
    tree(x2, y2, angle - spread, len * 0.7, d - 1)
    tree(x2, y2, angle + spread, len * 0.7, d - 1)
  }
  tree(w / 2, h * 0.85, -Math.PI / 2, h * 0.25 * scale, depth)
  return paths
}

export function generateWave(
  w: number, h: number, iterations: number, scale: number,
  palette: string[], rng: Rng, strokeWidth: number, opacity: number
): string {
  let paths = ''
  const layers = Math.min(20, Math.floor(iterations / 10))
  for (let layer = 0; layer < layers; layer++) {
    const freq = 0.005 + rng() * 0.01
    const amp = 30 + rng() * 60 * scale
    const baseY = (layer / layers) * h
    const phase = rng() * Math.PI * 2
    let d = `M0,${baseY.toFixed(1)}`
    for (let x = 0; x <= w; x += 4) {
      const y = baseY + Math.sin(x * freq + phase) * amp + Math.cos(x * freq * 2 + phase) * amp * 0.3
      d += ` L${x},${y.toFixed(1)}`
    }
    const color = palette[layer % palette.length]
    paths += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`
  }
  return paths
}

export function generateCircles(
  w: number, h: number, iterations: number, scale: number,
  palette: string[], rng: Rng, strokeWidth: number, opacity: number
): string {
  let paths = ''
  for (let i = 0; i < iterations; i++) {
    const cx = rng() * w
    const cy = rng() * h
    const r = 5 + rng() * 80 * scale
    const color = palette[i % palette.length]
    paths += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`
  }
  return paths
}

export function generateNoise(
  w: number, h: number, iterations: number, scale: number,
  palette: string[], rng: Rng, strokeWidth: number, opacity: number
): string {
  let paths = ''
  const step = Math.max(4, Math.floor(20 / scale))
  const cols = Math.floor(w / step)
  const rows = Math.floor(h / step)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (rng() > 0.4) continue
      const x = col * step
      const y = row * step
      const len = 5 + rng() * 15 * scale
      const angle = rng() * Math.PI * 2
      const x2 = x + Math.cos(angle) * len
      const y2 = y + Math.sin(angle) * len
      const color = palette[(row + col) % palette.length]
      paths += `<line x1="${x}" y1="${y}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`
    }
  }
  return paths
}

export function applyMirror(content: string, mode: MirrorMode, w: number, h: number): string {
  if (mode === 'none') return content

  const wrap = (inner: string, tx: number, ty: number, sx: number, sy: number) =>
    `<g transform="translate(${tx},${ty}) scale(${sx},${sy})">${inner}</g>`

  switch (mode) {
    case 'horizontal':
      return content + wrap(content, w, 0, -1, 1)
    case 'vertical':
      return content + wrap(content, 0, h, 1, -1)
    case 'quad':
      return (
        content +
        wrap(content, w, 0, -1, 1) +
        wrap(content, 0, h, 1, -1) +
        wrap(content, w, h, -1, -1)
      )
    case 'radial': {
      let result = content
      const segments = 8
      const cx = w / 2
      const cy = h / 2
      for (let i = 1; i < segments; i++) {
        const angle = (360 / segments) * i
        const flip = i % 2 === 1 ? -1 : 1
        result += `<g transform="translate(${cx},${cy}) rotate(${angle}) scale(${flip},1) translate(${-cx},${-cy})">${content}</g>`
      }
      return result
    }
    default:
      return content
  }
}

export function buildCollage(
  cellContent: string,
  cols: number,
  rows: number,
  cellW: number,
  cellH: number,
  gap: number,
  bgColor: string
): string {
  let tiles = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * (cellW + gap)
      const y = r * (cellH + gap)
      const flipX = c % 2 === 1 ? -1 : 1
      const flipY = r % 2 === 1 ? -1 : 1
      const tile = `<g transform="translate(${x + cellW / 2},${y + cellH / 2}) scale(${flipX},${flipY}) translate(${-cellW / 2},${-cellH / 2})">
        <svg width="${cellW}" height="${cellH}" viewBox="0 0 ${cellW} ${cellH}" overflow="hidden">${cellContent}</svg>
      </g>`
      tiles += tile
    }
  }
  const totalW = cols * cellW + (cols - 1) * gap
  const totalH = rows * cellH + (rows - 1) * gap
  return `<rect width="${totalW}" height="${totalH}" fill="${bgColor}"/>${tiles}`
}
