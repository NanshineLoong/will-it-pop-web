function shuffle(items) {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  return result
}

/**
 * Returns a balanced hot/cold sample when possible.
 * If one side runs short, fills from the other side instead.
 */
export function sampleQuestions(questions, count) {
  const hot = shuffle(questions.filter((question) => question.is_hot))
  const cold = shuffle(questions.filter((question) => !question.is_hot))
  const total = hot.length + cold.length

  if (total <= count) {
    return shuffle([...hot, ...cold])
  }

  const targetHot = Math.floor(count / 2)
  const hotCount = Math.min(targetHot, hot.length)
  const coldCount = Math.min(count - hotCount, cold.length)
  const finalHotCount = Math.min(count - coldCount, hot.length)

  return shuffle([...hot.slice(0, finalHotCount), ...cold.slice(0, coldCount)])
}
