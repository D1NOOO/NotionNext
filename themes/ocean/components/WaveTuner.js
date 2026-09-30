import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_WAVE_TUNING,
  WAVE_TUNING_CONTROLS,
  WAVE_TUNING_STORAGE_KEY,
  exportWaveTuning,
  waveTuningValue,
  withWaveTuningValue
} from '../waveTuning'

function Slider({ control, settings, onChange, onCommit }) {
  const value = waveTuningValue(settings, control.key)
  const id = `ocean-tune-${control.key.replace('.', '-')}`
  const formatted = (value * (control.factor || 1)).toFixed(control.digits)
  return (
    <div className='ocean-tuner-slider'>
      <div>
        <label htmlFor={id}>{control.label}</label>
        <output htmlFor={id}>
          {formatted}
          {control.unit && <small> {control.unit}</small>}
        </output>
      </div>
      <input
        id={id}
        type='range'
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        aria-valuetext={`${formatted}${control.unit || ''}`}
        onChange={event => onChange(control.key, Number(event.target.value))}
        onPointerUp={onCommit}
        onKeyUp={onCommit}
      />
      {control.hint && <small>{control.hint}</small>}
    </div>
  )
}

export default function WaveTuner() {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [settings, setSettings] = useState(DEFAULT_WAVE_TUNING)
  const [message, setMessage] = useState('')
  const [showExport, setShowExport] = useState(false)
  const settingsRef = useRef(settings)
  const pendingRef = useRef(null)
  const timerRef = useRef(null)
  const exportRef = useRef(null)

  useEffect(() => {
    const sync = () => {
      const renderer = window.__ocean
      setReady(Boolean(renderer?.setTuning))
      if (!renderer?.state.tuning) return
      clearTimeout(timerRef.current)
      timerRef.current = null
      pendingRef.current = null
      settingsRef.current = renderer.state.tuning
      setSettings(renderer.state.tuning)
    }
    sync()
    window.addEventListener('ocean:renderer-ready', sync)
    return () => {
      clearTimeout(timerRef.current)
      window.removeEventListener('ocean:renderer-ready', sync)
    }
  }, [])

  function flush() {
    clearTimeout(timerRef.current)
    timerRef.current = null
    const next = pendingRef.current
    if (!next) return settingsRef.current
    pendingRef.current = null
    const renderer = window.__ocean
    if (!renderer?.setTuning) {
      setReady(false)
      setMessage('海洋正在加载，请稍后再试。')
      return settingsRef.current
    }
    try {
      const applied = renderer.setTuning(next)
      settingsRef.current = applied
      setSettings(applied)
      try {
        window.localStorage.setItem(
          WAVE_TUNING_STORAGE_KEY,
          exportWaveTuning(applied)
        )
      } catch {
        setMessage('预览已生效；浏览器未允许保存，请复制参数。')
      }
      return applied
    } catch {
      setMessage('这组参数未能应用，请恢复默认参数后再试。')
      return settingsRef.current
    }
  }

  function change(key, value) {
    const next = withWaveTuningValue(settingsRef.current, key, value)
    settingsRef.current = next
    pendingRef.current = next
    setSettings(next)
    setMessage('')
    // Coalesce dragging events; shape changes rebuild at most one spectrum per tick.
    if (timerRef.current === null) timerRef.current = setTimeout(flush, 120)
  }

  function reset() {
    clearTimeout(timerRef.current)
    timerRef.current = null
    pendingRef.current = null
    const renderer = window.__ocean
    if (!renderer?.setTuning) return
    const next = renderer.setTuning(renderer.defaultTuning)
    settingsRef.current = next
    setSettings(next)
    try {
      window.localStorage.removeItem(WAVE_TUNING_STORAGE_KEY)
    } catch {}
    setMessage('已恢复默认参数。')
  }

  async function copy() {
    const text = exportWaveTuning(flush())
    try {
      await navigator.clipboard.writeText(text)
      setMessage('参数已复制，可以粘贴发给我。')
    } catch {
      setShowExport(true)
      setMessage('请选中下面的参数文本，复制后发给我。')
    }
  }

  useEffect(() => {
    if (showExport) {
      exportRef.current?.focus()
      exportRef.current?.select()
    }
  }, [showExport])

  return (
    <div className='ocean-tuner'>
      {open && (
        <section id='ocean-wave-tuner' aria-label='海浪参数面板'>
          <header>
            <div>
              <small>OCEAN / LIVE TUNING</small>
              <h2>调一片理想的海</h2>
            </div>
            <button
              type='button'
              onClick={() => setOpen(false)}
              aria-label='收起调参面板'
            >
              ×
            </button>
          </header>
          <p>拖动滑块实时预览。设置仅保存在当前浏览器。</p>
          {!ready && <p role='status'>等待实时海洋加载；静态背景无法调参。</p>}
          <div className='ocean-tuner-scroll'>
            <fieldset disabled={!ready}>
              <legend className='sr-only'>海浪参数</legend>
              {WAVE_TUNING_CONTROLS.filter(control => !control.advanced).map(
                control => (
                  <Slider
                    key={control.key}
                    control={control}
                    settings={settings}
                    onChange={change}
                    onCommit={flush}
                  />
                )
              )}
              <details className='ocean-tuner-advanced'>
                <summary>
                  更多细节参数
                  <svg
                    width='14'
                    height='14'
                    viewBox='0 0 16 16'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    aria-hidden='true'
                  >
                    <path d='m4 6 4 4 4-4' />
                  </svg>
                </summary>
                {WAVE_TUNING_CONTROLS.filter(control => control.advanced).map(
                  control => (
                    <Slider
                      key={control.key}
                      control={control}
                      settings={settings}
                      onChange={change}
                      onCommit={flush}
                    />
                  )
                )}
              </details>
            </fieldset>
            {showExport && (
              <textarea
                ref={exportRef}
                aria-label='当前海浪参数'
                readOnly
                rows={8}
                value={exportWaveTuning(settings)}
              />
            )}
          </div>
          <footer>
            <div>
              <button
                type='button'
                className='ocean-tuner-copy'
                onClick={() => {
                  void copy()
                }}
                disabled={!ready}
              >
                复制参数
              </button>
              <button type='button' onClick={reset} disabled={!ready}>
                恢复默认参数
              </button>
            </div>
            <button
              type='button'
              className='ocean-tuner-export'
              onClick={() => setShowExport(value => !value)}
            >
              {showExport ? '收起参数文本' : '显示参数文本'}
            </button>
            <p role='status'>{message || '满意后，复制参数发给我。'}</p>
          </footer>
        </section>
      )}
      <button
        type='button'
        className='ocean-tuner-toggle'
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-controls='ocean-wave-tuner'
      >
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          aria-hidden='true'
        >
          <path d='M4 7h16M4 17h16' />
          <circle cx='9' cy='7' r='3' fill='#092b3b' />
          <circle cx='15' cy='17' r='3' fill='#092b3b' />
        </svg>
        波浪调参
      </button>
    </div>
  )
}
