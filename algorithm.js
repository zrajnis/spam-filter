const _ = require('lodash')
const fs = require('fs')

const classifier = {
  fc: {},
  cc: {},
  thresholds: {},
}

//TODO: introduce db

classifier.catCount = function (cat) {
  return this.cc[cat] ? this.cc[cat] : 0
}

classifier.ftrCount = function (ftr, cat) {
  return this.fc[ftr] && this.fc[ftr][cat] ? this.fc[ftr][cat] : 0
}

classifier.ftrProb = function (ftr, cat) {
  return this.catCount(cat) === 0 ? 0 : this.ftrCount(ftr, cat) / this.catCount(cat)
}

classifier.getCategories = function () {
  return _.keys(this.cc)
}

classifier.getFeatures = function (text) {
  const words = _.map(text.match(/[a-z'\-]+/gi), _.toLower)

  return words
}

classifier.getThreshold = function (cat) {
  return this.thresholds[cat] ? this.thresholds[cat] : 1
}

/*function getWordsFromDoc (doc) {
  const text = fs.readFileSync('./mytext.txt", "utf-8');
}*/

classifier.incCat = function (cat) {
  this.cc[cat] = this.cc[cat] ? this.cc[cat] + 1 : 1
}

classifier.incFtr = function (ftr,cat) {
  if (!this.fc[ftr]) {
    this.fc[ftr] = {}
  }
  this.fc[ftr][cat] = this.fc[ftr][cat] ? this.fc[ftr][cat] + 1 : 1
}

classifier.sampleTrain = function () {
  this.train('Nobody owns the water.', 'good')
  this.train('the quick rabbit jumps fences', 'good')
  this.train('buy pharmaceuticals now', 'bad')
  this.train('make quick money at the online casino', 'bad')
  this.train('the quick brown fox jumps', 'good')
}

classifier.setThreshold = function (cat, t) {
  this.thresholds[cat] = t
}

classifier.totalCount = function () {
  return _.reduce(this.cc, function (result, value) {
    return result + value
  }, 0)
}

classifier.train = function (item, cat) {
  _.map(this.getFeatures(item), function (feature) {
    return classifier.incFtr(feature, cat)
  })

  this.incCat(cat)
}

classifier.weightedProb = function (ftr, cat, weight = 1, assumedProb = 0.5) {
  const basicProb = this.ftrProb(ftr, cat)
  const totals = _.reduce(this.getCategories(), function (result, category) {
    return result + classifier.ftrCount(ftr, category)
  }, 0)

  return ((weight * assumedProb) + (totals * basicProb)) / (weight + totals)
}

const naiveBayes = _.assign({}, classifier)

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
  ftrProb: naiveBayes.ftrProb,
  sampleTrain: naiveBayes.sampleTrain,
  train: naiveBayes.train,
  weightedProb: naiveBayes.weightedProb,
  classify: naiveBayes.classify,
}
