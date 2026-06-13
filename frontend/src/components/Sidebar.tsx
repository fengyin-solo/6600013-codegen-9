import { useDesignStore } from '../store/design'
import { THEMES } from '../themes/palettes'
import type { PatternType, MirrorMode } from '../types'

const PATTERNS: { value: PatternType; label: string }[] = [
  { value: 'spiral',  label: '🌀 螺旋' },
  { value: 'fractal', label: '🌳 分形树' },
  { value: 'wave',    label: '🌊 波浪' },
  { value: 'circles', label: '⭕ 圆环' },
  { value: 'noise',   label: '🎲 噪声场' },
]

const MIRROR_MODES: { value: MirrorMode; label: string }[] = [
  { value: 'none',       label: '无' },
  { value: 'horizontal', label: '水平' },
  { value: 'vertical',   label: '垂直' },
  { value: 'quad',       label: '四象' },
  { value: 'radial',     label: '放射' },
]

export default function Sidebar() {
  const store = useDesignStore()

  return (
    <div className="w-72 bg-gray-900 border-l border-gray-700 p-4 overflow-y-auto flex flex-col gap-4">
      <h2 className="text-lg font-bold">🎨 SVG 海报设计器</h2>

      {/* Pattern */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">图案类型</label>
        <div className="grid grid-cols-2 gap-2">
          {PATTERNS.map(p => (
            <button key={p.value} onClick={() => store.setPattern(p.value)}
              className={`px-2 py-1.5 rounded text-xs font-medium ${store.pattern===p.value?'bg-indigo-600':'bg-gray-700 hover:bg-gray-600'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">颜色主题</label>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map(t => (
            <button key={t.id} onClick={() => store.setTheme(t.id)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600">
              <div className="flex">{t.colors.map((c,i) => (
                <div key={i} style={{background:c}} className="w-3 h-3 rounded-full" />
              ))}</div>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Seed */}
      <div>
        <label className="text-xs text-gray-400">种子: {store.seed}</label>
        <div className="flex gap-2 mt-1">
          <input type="range" min={0} max={99999} value={store.seed}
            onChange={e => store.setParam('seed', Number(e.target.value))} className="flex-1 accent-indigo-500" />
          <button onClick={() => store.randomSeed()} className="px-2 bg-indigo-600 rounded text-xs">🎲</button>
        </div>
      </div>

      {/* Iterations */}
      <div>
        <label className="text-xs text-gray-400">迭代数: {store.iterations}</label>
        <input type="range" min={10} max={500} step={10} value={store.iterations}
          onChange={e => store.setParam('iterations', Number(e.target.value))} className="w-full accent-purple-500" />
      </div>

      {/* Scale */}
      <div>
        <label className="text-xs text-gray-400">缩放: {store.scale.toFixed(2)}</label>
        <input type="range" min={0.1} max={3} step={0.1} value={store.scale}
          onChange={e => store.setParam('scale', Number(e.target.value))} className="w-full accent-green-500" />
      </div>

      {/* Rotation */}
      <div>
        <label className="text-xs text-gray-400">旋转: {store.rotation}°</label>
        <input type="range" min={0} max={360} step={5} value={store.rotation}
          onChange={e => store.setParam('rotation', Number(e.target.value))} className="w-full accent-yellow-500" />
      </div>

      {/* Stroke */}
      <div>
        <label className="text-xs text-gray-400">描边: {store.strokeWidth.toFixed(1)}</label>
        <input type="range" min={0.5} max={5} step={0.5} value={store.strokeWidth}
          onChange={e => store.setParam('strokeWidth', Number(e.target.value))} className="w-full accent-orange-500" />
      </div>

      {/* Opacity */}
      <div>
        <label className="text-xs text-gray-400">透明度: {store.opacity.toFixed(2)}</label>
        <input type="range" min={0.1} max={1} step={0.05} value={store.opacity}
          onChange={e => store.setParam('opacity', Number(e.target.value))} className="w-full accent-pink-500" />
      </div>

      {/* Mirror Mode */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">镜像模式</label>
        <div className="grid grid-cols-5 gap-1">
          {MIRROR_MODES.map(m => (
            <button key={m.value} onClick={() => store.setMirrorMode(m.value)}
              className={`px-1 py-1.5 rounded text-xs font-medium ${store.mirrorMode === m.value ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Collage Layout */}
      <div className="border-t border-gray-700 pt-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-400">拼贴布局</label>
          <button onClick={() => store.toggleCollage()}
            className={`w-10 h-5 rounded-full transition-colors relative ${store.collageEnabled ? 'bg-indigo-600' : 'bg-gray-600'}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${store.collageEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {store.collageEnabled && (
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-400">列数: {store.collageCols}</label>
              <input type="range" min={2} max={6} step={1} value={store.collageCols}
                onChange={e => store.setParam('collageCols', Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400">行数: {store.collageRows}</label>
              <input type="range" min={2} max={6} step={1} value={store.collageRows}
                onChange={e => store.setParam('collageRows', Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400">间距: {store.collageGap}px</label>
              <input type="range" min={0} max={20} step={1} value={store.collageGap}
                onChange={e => store.setParam('collageGap', Number(e.target.value))} className="w-full accent-amber-500" />
            </div>
          </div>
        )}
      </div>

      {/* Export */}
      <div className="flex gap-2 mt-2">
        <button onClick={() => store.exportSvg()} className="flex-1 py-2 bg-teal-600 rounded text-sm font-medium">⬇ SVG</button>
        <button onClick={() => store.exportPng()} className="flex-1 py-2 bg-rose-600 rounded text-sm font-medium">⬇ PNG</button>
      </div>
    </div>
  )
}
