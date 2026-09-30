export const WAVE_TUNING_STORAGE_KEY = 'ocean:wave-tuning:v1'

export const DEFAULT_WAVE_TUNING = Object.freeze({
  long: Object.freeze({
    rmsHeight: 0.18,
    windSpeed: 5.9,
    smallWaveDamping: 0.2,
    choppiness: 1.35,
    spreading: 3
  }),
  detail: Object.freeze({
    rmsHeight: 0.011,
    maxWavelength: 2.2,
    smallWaveDamping: 0.044,
    windSpeed: 4,
    choppiness: 0.36,
    spreading: 2
  }),
  ripple: Object.freeze({
    rmsHeight: 0.003,
    maxWavelength: 0.5,
    smallWaveDamping: 0.018,
    spreading: 1
  }),
  glintSoftness: 0.35,
  speed: 0.45
})

// Bounds keep experimental waves inside the renderer's intersection envelope.
export const WAVE_TUNING_CONTROLS = [
  {
    key: 'long.windSpeed',
    label: '主浪尺度',
    min: 2,
    max: 10,
    step: 0.1,
    digits: 1,
    hint: '向右：波峰间距更大'
  },
  {
    key: 'long.rmsHeight',
    label: '主浪高度',
    min: 0,
    max: 0.25,
    step: 0.005,
    digits: 1,
    factor: 100,
    unit: 'cm'
  },
  {
    key: 'long.choppiness',
    label: '波峰陡度',
    min: 0,
    max: 1.6,
    step: 0.05,
    digits: 2,
    hint: '向左：波峰更圆缓'
  },
  {
    key: 'detail.rmsHeight',
    label: '细浪强度',
    min: 0,
    max: 0.04,
    step: 0.0005,
    digits: 2,
    factor: 100,
    unit: 'cm'
  },
  {
    key: 'detail.maxWavelength',
    label: '细浪尺度',
    min: 0.3,
    max: 4,
    step: 0.05,
    digits: 2,
    unit: 'm'
  },
  {
    key: 'ripple.rmsHeight',
    label: '毛细纹强度',
    min: 0,
    max: 0.008,
    step: 0.0001,
    digits: 1,
    factor: 1000,
    unit: 'mm'
  },
  {
    key: 'long.smallWaveDamping',
    label: '主浪平滑度',
    min: 0.05,
    max: 0.5,
    step: 0.01,
    digits: 2,
    advanced: true
  },
  {
    key: 'detail.windSpeed',
    label: '细浪风速',
    min: 1,
    max: 6,
    step: 0.1,
    digits: 1,
    unit: 'm/s',
    advanced: true
  },
  {
    key: 'detail.choppiness',
    label: '细浪陡度',
    min: 0,
    max: 0.8,
    step: 0.02,
    digits: 2,
    advanced: true
  },
  {
    key: 'detail.smallWaveDamping',
    label: '细浪平滑度',
    min: 0.005,
    max: 0.15,
    step: 0.001,
    digits: 3,
    advanced: true
  },
  {
    key: 'ripple.maxWavelength',
    label: '毛细纹尺度',
    min: 0.1,
    max: 0.6,
    step: 0.01,
    digits: 2,
    unit: 'm',
    advanced: true
  },
  {
    key: 'ripple.smallWaveDamping',
    label: '毛细纹平滑度',
    min: 0.003,
    max: 0.08,
    step: 0.001,
    digits: 3,
    advanced: true
  },
  {
    key: 'glintSoftness',
    label: '反光柔和度',
    min: 0.12,
    max: 0.5,
    step: 0.01,
    digits: 2,
    advanced: true
  },
  {
    key: 'speed',
    label: '动画速度',
    min: 0,
    max: 1.5,
    step: 0.05,
    digits: 2,
    unit: '×',
    advanced: true
  }
]

export function waveTuningValue(settings, key) {
  return key.split('.').reduce((value, part) => value?.[part], settings)
}

export function withWaveTuningValue(settings, key, value) {
  const [group, field] = key.split('.')
  return field
    ? { ...settings, [group]: { ...settings[group], [field]: value } }
    : { ...settings, [group]: value }
}

export function normalizeWaveTuning(value, defaults = DEFAULT_WAVE_TUNING) {
  let result = {
    ...defaults,
    long: { ...defaults.long },
    detail: { ...defaults.detail },
    ripple: { ...defaults.ripple }
  }
  for (const control of WAVE_TUNING_CONTROLS) {
    const candidate = waveTuningValue(value, control.key)
    if (typeof candidate !== 'number' || !Number.isFinite(candidate)) continue
    result = withWaveTuningValue(
      result,
      control.key,
      Math.min(control.max, Math.max(control.min, candidate))
    )
  }
  return result
}

export function readSavedWaveTuning() {
  if (typeof window === 'undefined') return null
  try {
    const saved = JSON.parse(
      window.localStorage.getItem(WAVE_TUNING_STORAGE_KEY)
    )
    return saved?.version === 1 ? saved : null
  } catch {
    return null
  }
}

export function exportWaveTuning(settings) {
  return JSON.stringify({ version: 1, ...settings }, null, 2)
}
