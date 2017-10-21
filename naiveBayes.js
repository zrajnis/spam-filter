const _ = require('lodash')

const naiveBayes = _.assign({}, require('./classifier'))

naiveBayes.classify = function (item, def = 'None') {
  let best = 'None'
  let max = 0
  const categories = this.getCategories()
  const probs = {}

  _.each(categories, function (cat) {
    probs[cat] = naiveBayes.prob(item, cat)

    if (probs[cat] > max) {
      max = probs[cat]
      best = cat
    }
  })

  return _.find(_.keys(probs), function (cat) {
    return cat !== best && probs[cat] * naiveBayes.getThreshold(best) > probs[best]
  }) ? def : best
}

naiveBayes.docProb = function (item, cat) {
  return _.reduce(this.getFeatures(item), function (result, feature) {
    return result * naiveBayes.weightedProb(feature, cat)
  }, 1)
}

naiveBayes.prob = function (item, cat) {
  const catProb = this.catCount(cat) / this.totalCount()
  const docProb = this.docProb(item, cat)

  return docProb * catProb
}

naiveBayes.setThreshold('bad', 3)
naiveBayes.sampleTrain()
console.log('threshold for bad is ' + naiveBayes.getThreshold('bad'))
console.log('good quick ' + naiveBayes.ftrCount('quick', 'good'))
console.log('bad quick ' + naiveBayes.ftrCount('quick', 'bad'))
console.log('bayes prob for quick being in good category: ' + naiveBayes.prob('quick', 'good'))
console.log('bayes prob for quick being in bad category: ' + naiveBayes.prob('quick', 'bad'))
console.log('classify quick: ' + naiveBayes.classify('quick'))
console.log('bayes prob for quick money being in good category: ' + naiveBayes.prob('quick money', 'good'))
console.log('bayes prob for quick money being in bad category: ' + naiveBayes.prob('quick money', 'bad'))
console.log('classify quick money: ' + naiveBayes.classify('quick money'))


module.exports = {
  classify: naiveBayes.classify,
  sampleTrain: naiveBayes.sampleTrain,
  train: naiveBayes.train,
}
