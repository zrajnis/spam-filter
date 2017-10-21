const _ = require('lodash')
const fs = require('fs')

const classifier = {
  fc: {},
  cc: {},
}

classifier.getFeatures = getWords

//TODO: bind all functions to classifier
//TODO: naive bayesian classifier
//TODO: introduce db

function incFtr (ftr,cat) {
  if (!classifier.fc[ftr]) {
    classifier.fc[ftr] = {}
  }
  classifier.fc[ftr][cat] = classifier.fc[ftr][cat] ? classifier.fc[ftr][cat] + 1 : 1
}

function incCat (cat) {
  classifier.cc[cat] = classifier.cc[cat] ? classifier.cc[cat] + 1 : 1
}

function ftrCount (ftr, cat) {
  return classifier.fc[ftr] && classifier.fc[ftr][cat] ? classifier.fc[ftr][cat] : 0
}

function catCount (cat) {
  return classifier.cc[cat] ? classifier.cc[cat] : 0
}

function totalCount () {
  return _.reduce(classifier.cc, function (result, value) {
    return result + value
  }, 0)
}

function getCategories () {
  return _.keys(classifier.cc)
}

function getWords (text) {
  const words = _.map(text.match(/[a-z'\-]+/gi), _.toLower);

  return words
}

function getWordsFromDoc (doc) {
  const text = fs.readFileSync('./mytext.txt", "utf-8');
}

function ftrProb (ftr, cat) {
  return catCount(cat) === 0 ? 0 : ftrCount(ftr, cat) / catCount(cat)
}

function weightedProb(ftr, cat, probFn, weight = 1, assumedProb = 0.5) {
  const basicProb = probFn(ftr, cat)
  const totals = _.reduce(getCategories(), function (result, category) {
    return result + ftrCount(ftr, category)
  }, 0)

  return ((weight * assumedProb) + (totals * basicProb)) / (weight + totals)
}

function train (item, cat) {
  _.map(classifier.getFeatures(item), function (feature) {
    return incFtr(feature, cat)
  })

  incCat(cat)
}

function sampleTrain () {
  train('Nobody owns the water.', 'good')
  train('the quick rabbit jumps fences', 'good')
  train('buy pharmaceuticals now', 'bad')
  train('make quick money at the online casino', 'bad')
  train('the quick brown fox jumps', 'good')
}

sampleTrain();
console.log(JSON.stringify(classifier, null, 2))
console.log('good quick ' + ftrCount('quick', 'good'))
console.log('bad quick ' + ftrCount('quick', 'bad'))
console.log('probability for good quick ' + ftrProb('quick', 'good'))
console.log('weighted probability for good quick ' + weightedProb('quick', 'good', ftrProb))

module.exports = {
  getWords
}
