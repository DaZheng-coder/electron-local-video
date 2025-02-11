export const timeToFrames = (time: number, framesPerSecond: number) => {
  return time * framesPerSecond
}

export const framesToTime = (frames: number, framesPerSecond: number) => {
  return Math.ceil(frames / framesPerSecond)
}

export const getSteps = (totalFrames: number) => {
  const mainStep = Math.ceil(totalFrames / 6)
  const subStep = Math.ceil(mainStep / 10)
  return {
    mainStep,
    subStep
  }
}
