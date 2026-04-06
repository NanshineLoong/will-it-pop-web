export function calcScore(userAnswers, correctAnswers) {
  const total = userAnswers.length
  const correct = userAnswers.filter(
    (answer, index) => answer === correctAnswers[index],
  ).length

  return {
    correct,
    total,
    accuracy: total === 0 ? 0 : correct / total,
  }
}

export function getPersonalityLabel(accuracy) {
  if (accuracy >= 0.85) {
    return '爆款雷达型选手'
  }

  if (accuracy >= 0.7) {
    return '内容直觉型选手'
  }

  if (accuracy >= 0.55) {
    return '流量迷雾型选手'
  }

  return '反向指标型选手'
}
