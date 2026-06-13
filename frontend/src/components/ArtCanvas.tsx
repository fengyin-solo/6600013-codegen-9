import { useEffect, useRef } from 'react'
import { useDesignStore } from '../store/design'
import {
  createRng, generateSpiral, generateFractal, generateWave,
  generateCircles, generateNoise, applyMirror, buildCollage
} from '../generators/patterns'

function generatePatternContent(
  pattern: string, w: number, h: number, iterations: number, scale: number,
  palette: string[], rng: ReturnType<typeof createRng>, strokeWidth: number, opacity: number
): string {
  switch (pattern) {
    case 'spiral':  return generateSpiral(w, h, iterations, scale, palette, rng, strokeWidth, opacity)
    case 'fractal': return generateFractal(w, h, iterations, scale, palette, rng, strokeWidth, opacity)
    case 'wave':    return generateWave(w, h, iterations, scale, palette, rng, strokeWidth, opacity)
    case 'circles': return generateCircles(w, h, iterations, scale, palette, rng, strokeWidth, opacity)
    case 'noise':   return generateNoise(w, h, iterations, scale, palette, rng, strokeWidth, opacity)
    default:        return ''
  }
}

export default function ArtCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const store = useDesignStore()

  useEffect(() => {
    const {
      width, height, pattern, iterations, scale, palette, strokeWidth, opacity,
      bgColor, rotation, collageEnabled, collageCols, collageRows, mirrorMode, collageGap
    } = store
    const rng = createRng(store.seed)

    let svg: string
    if (collageEnabled) {
      const cellW = (width - (collageCols - 1) * collageGap) / collageCols
      const cellH = (height - (collageRows - 1) * collageGap) / collageRows
      const rawContent = generatePatternContent(pattern, cellW, cellH, iterations, scale, palette, rng, strokeWidth, opacity)
      const mirrored = applyMirror(rawContent, mirrorMode, cellW, cellH)
      const cellSvg = `<rect width="${cellW}" height="${cellH}" fill="${bgColor}"/>
  <g transform="rotate(${rotation},${cellW / 2},${cellH / 2})">${mirrored}</g>`
      const collageContent = buildCollage(cellSvg, collageCols, collageRows, cellW, cellH, collageGap, bgColor)
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${collageContent}
</svg>`
    } else {
      const rawContent = generatePatternContent(pattern, width, height, iterations, scale, palette, rng, strokeWidth, opacity)
      const mirrored = applyMirror(rawContent, mirrorMode, width, height)
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <g transform="rotate(${rotation},${width / 2},${height / 2})">${mirrored}</g>
</svg>`
    }

    store.setSvgContent(svg)
    if (containerRef.current) {
      containerRef.current.innerHTML = svg
    }
  }, [
    store.pattern, store.seed, store.iterations, store.scale, store.rotation,
    store.strokeWidth, store.opacity, store.bgColor, store.palette, store.width, store.height,
    store.collageEnabled, store.collageCols, store.collageRows, store.mirrorMode, store.collageGap
  ])

  return (
    <div
      ref={containerRef}
      className="shadow-2xl rounded border border-gray-700"
      style={{ maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }}
    />
  )
}
