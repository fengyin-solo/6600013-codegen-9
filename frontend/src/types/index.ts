export type PatternType = 'spiral' | 'fractal' | 'wave' | 'circles' | 'voronoi' | 'noise'
export type MirrorMode = 'none' | 'horizontal' | 'vertical' | 'quad' | 'radial'

export interface DesignParams {
  pattern: PatternType
  seed: number
  iterations: number
  scale: number
  rotation: number
  strokeWidth: number
  opacity: number
  bgColor: string
  palette: string[]
  width: number
  height: number
  collageEnabled: boolean
  collageCols: number
  collageRows: number
  mirrorMode: MirrorMode
  collageGap: number
}

export interface ColorTheme {
  id: string
  name: string
  colors: string[]
}
