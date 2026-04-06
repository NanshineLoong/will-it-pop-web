import { describe, expect, it } from 'vitest'
import { calcScore, getPersonalityLabel } from './scoring'

describe('calcScore', () => {
  it('returns correct count and accuracy', () => {
    const answers = [true, true, false, true]
    const correct = [true, false, false, true]
    const result = calcScore(answers, correct)

    expect(result.correct).toBe(3)
    expect(result.total).toBe(4)
    expect(result.accuracy).toBeCloseTo(0.75)
  })
})

describe('getPersonalityLabel', () => {
  it('returns 爆款雷达型选手 for >= 85%', () => {
    expect(getPersonalityLabel(0.85)).toBe('爆款雷达型选手')
    expect(getPersonalityLabel(1)).toBe('爆款雷达型选手')
  })

  it('returns 内容直觉型选手 for 70-84%', () => {
    expect(getPersonalityLabel(0.7)).toBe('内容直觉型选手')
    expect(getPersonalityLabel(0.84)).toBe('内容直觉型选手')
  })

  it('returns 流量迷雾型选手 for 55-69%', () => {
    expect(getPersonalityLabel(0.55)).toBe('流量迷雾型选手')
    expect(getPersonalityLabel(0.69)).toBe('流量迷雾型选手')
  })

  it('returns 反向指标型选手 for < 55%', () => {
    expect(getPersonalityLabel(0.54)).toBe('反向指标型选手')
    expect(getPersonalityLabel(0)).toBe('反向指标型选手')
  })
})
