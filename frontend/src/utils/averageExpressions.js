export const averageExpressions = (expressionsList) => {
  const avg = {}

  expressionsList.forEach(exp => {
    Object.keys(exp).forEach(key => {
      avg[key] = (avg[key] || 0) + exp[key]
    })
  })

  Object.keys(avg).forEach(key => {
    avg[key] /= expressionsList.length
  })

  return mapToMood(avg)
}
