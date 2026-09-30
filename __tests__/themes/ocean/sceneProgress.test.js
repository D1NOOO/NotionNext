import { readingPhase } from '@/themes/ocean/sceneProgress'

describe('Ocean reading transition', () => {
  it('shows the hero before the reading transition', () => {
    expect(readingPhase(0)).toEqual({
      heroOpacity: 1,
      journalOpacity: 0,
      reading: false
    })
  })
  it('crossfades and finishes revealing articles at 60% of the dive', () => {
    expect(readingPhase(0.475).journalOpacity).toBeCloseTo(0.5)
    expect(readingPhase(0.6)).toEqual({
      heroOpacity: 0,
      journalOpacity: 1,
      reading: true
    })
  })
  it('keeps articles visible at the bottom and respects a configured start', () => {
    expect(readingPhase(1).journalOpacity).toBe(1)
    expect(readingPhase(0.6, 0.8).reading).toBe(false)
    expect(readingPhase(0.8, 0.8).journalOpacity).toBe(1)
  })
})
