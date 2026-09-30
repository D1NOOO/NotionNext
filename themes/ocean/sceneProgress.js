export function readingPhase(progress, start = 0.6) {
  const journalOpacity = Math.min(
    1,
    Math.max(0, (progress - start + 0.25) / 0.25)
  )
  return {
    journalOpacity,
    heroOpacity: 1 - journalOpacity,
    reading: progress >= start
  }
}
