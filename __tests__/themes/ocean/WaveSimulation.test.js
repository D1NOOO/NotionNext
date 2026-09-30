/** @jest-environment node */
import { Vector4 } from 'three'
import { createWaveSimulation } from '../../../themes/ocean/engine/WaveSimulation'

// This recorder checks submissions and resource ownership, not GLSL output.
function recorder() {
  let target = null
  const targets = new Set()
  const submissions = []
  return {
    targets,
    submissions,
    autoClear: true,
    xr: { enabled: false },
    extensions: { has: () => true },
    getRenderTarget: () => target,
    getActiveCubeFace: () => 0,
    getActiveMipmapLevel: () => 0,
    getViewport: value => value.copy(new Vector4(0, 0, 640, 480)),
    getScissor: value => value.copy(new Vector4(0, 0, 640, 480)),
    getScissorTest: () => false,
    setViewport() {},
    setScissor() {},
    setScissorTest() {},
    setRenderTarget(value) {
      target = value
      if (value) targets.add(value)
    },
    render(scene) {
      const uniforms = scene.children[0].material.uniforms
      if (uniforms.uInitial)
        submissions.push({
          initial: uniforms.uInitial.value,
          amplitude: uniforms.uAmplitude.value,
          choppiness: uniforms.uChoppiness.value
        })
    }
  }
}

test('height and steepness tuning reuses spectrum data and invalidates a paused frame', () => {
  const renderer = recorder()
  const simulation = createWaveSimulation(renderer, {
    resolution: 8,
    detailResolution: 8
  })
  try {
    const initial = renderer.submissions[0].initial
    const data = initial.image.data
    const textures = [simulation.texture, simulation.detailTexture]
    const targetCount = renderer.targets.size
    const count = renderer.submissions.length
    const originalHeight = simulation.parameters.long.rmsHeight

    simulation.setParameters({
      long: { rmsHeight: originalHeight * 0.5, choppiness: 0.2 }
    })
    simulation.update(0)
    expect(renderer.submissions.length).toBe(count + 2)
    expect(renderer.submissions[count].amplitude).toBeCloseTo(0.5)
    expect(renderer.submissions[count].choppiness).toBe(0.2)
    expect(renderer.submissions[count].initial).toBe(initial)
    expect(initial.image.data).toBe(data)
    expect([simulation.texture, simulation.detailTexture]).toEqual(textures)
    expect(renderer.targets.size).toBe(targetCount)

    const after = renderer.submissions.length
    expect(simulation.setParameters({ long: { choppiness: 0.2 } })).toBe(false)
    simulation.update(0)
    expect(renderer.submissions.length).toBe(after)
  } finally {
    simulation.dispose()
  }
})

test('a flat layer can be raised and reshaped without allocating new FFT targets', () => {
  const renderer = recorder()
  const simulation = createWaveSimulation(renderer, {
    resolution: 8,
    detailResolution: 8,
    long: { rmsHeight: 0 },
    ripple: { resolution: 8, rmsHeight: 0 }
  })
  try {
    const initial = renderer.submissions[0].initial
    const data = initial.image.data
    const targetCount = renderer.targets.size
    expect(renderer.submissions[0].amplitude).toBe(0)
    expect(data.some(value => value !== 0)).toBe(true)

    simulation.setParameters({
      long: { rmsHeight: 0.12 },
      ripple: { rmsHeight: 0.002 }
    })
    simulation.update(0)
    expect(renderer.submissions[3].amplitude).toBeCloseTo(0.12)
    expect(renderer.submissions[5].amplitude).toBeCloseTo(0.002)

    simulation.setParameters({ long: { windSpeed: 4 } })
    simulation.update(0)
    expect(initial.image.data).not.toBe(data)
    expect(renderer.submissions[6].initial).toBe(initial)
    expect(simulation.parameters.long.rmsHeight).toBe(0.12)
    expect(renderer.targets.size).toBe(targetCount)
  } finally {
    simulation.dispose()
  }
})

test('invalid multi-layer tuning is atomic and changing the grid is rejected', () => {
  const renderer = recorder()
  const simulation = createWaveSimulation(renderer, {
    resolution: 8,
    detailResolution: 8
  })
  const before = simulation.parameters
  const data = renderer.submissions[0].initial.image.data
  expect(() =>
    simulation.setParameters({
      long: { windSpeed: 4 },
      detail: { rmsHeight: NaN }
    })
  ).toThrow()
  expect(simulation.parameters).toBe(before)
  expect(renderer.submissions[0].initial.image.data).toBe(data)
  expect(() => simulation.setParameters({ long: { resolution: 16 } })).toThrow()
  expect(() =>
    simulation.setParameters({ ripple: { rmsHeight: 0.001 } })
  ).toThrow()
  simulation.dispose()
  expect(() => simulation.setParameters({ long: { rmsHeight: 0.1 } })).toThrow(
    /disposed/
  )
})
