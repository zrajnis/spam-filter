const naiveBayes = require('./classifier')

naiveBayes.classify = function (item, def = 'none') {
  let best = 'none'
  let max = 0
  const categories = this.getCategories()
  const probs = {}

  categories.forEach(function (cat) {
    probs[cat] = naiveBayes.prob(item, cat)

    if (probs[cat] > max) {
      max = probs[cat]
      best = cat
    }
  })

  return Object.keys(probs).find(
    cat => cat !== best && probs[cat] * naiveBayes.getThreshold(best) > probs[best])
     ? def : best
}

naiveBayes.docProb = function (item, cat) {
  return this.getFeatures(item).reduce(
    (result, feature) => result * this.weightedProb(feature, cat), 1)
}

naiveBayes.prob = function (item, cat) {
  const catProb = this.catCount(cat) / this.totalCount()
  const docProb = this.docProb(item, cat)

  return docProb * catProb
}

module.exports = naiveBayes
