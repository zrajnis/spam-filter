const _ = require('lodash')
const fs = require('fs')

const classifier = {
  fc: {},
  cc: {},
}

//TODO: naive bayesian classifier
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

classifier.sampleTrain()
console.log(JSON.stringify(classifier, null, 2))
console.log('good quick ' + classifier.ftrCount('quick', 'good'))
console.log('bad quick ' + classifier.ftrCount('quick', 'bad'))
console.log('probability for good quick ' + classifier.ftrProb('quick', 'good'))
console.log('weighted probability for good quick ' + classifier.weightedProb('quick', 'good'))

module.exports = {
  ftrProb: classifier.ftrProb,
  sampleTrain: classifier.sampleTrain,
  train: classifier.train,
  weightedProb: classifier.weightedProb,
}
