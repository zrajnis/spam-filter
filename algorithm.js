const _ = require('lodash')
const fs = require('fs')

const classifier = {
  fc: {},
  cc: {},
}

classifier.getFeatures = getWords

//TODO: bind all functions to classifier
//TODO: weight factors
//TODO: naive bayesian classifier
//TODO: introduce db

function incFtr (f,cat) {
  if (!classifier.fc[f]) {
    classifier.fc[f] = {}
  }
  classifier.fc[f][cat] = classifier.fc[f][cat] ? classifier.fc[f][cat] + 1 : 1
}

function incCat (cat) {
  classifier.cc[cat] = classifier.cc[cat] ? classifier.cc[cat] + 1 : 1
}

function ftrCount (f, cat) {
  return classifier.fc[f] && classifier.fc[f][cat] ? classifier.fc[f][cat] : 1
}

function catCount (cat) {
  return classifier.cc[cat] ? classifier.cc[cat] : 1
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
console.log('quick thats good ' + ftrCount('quick', 'good'))
console.log('quick thats bad ' + ftrCount('quick', 'bad'))

module.exports = {
  getWords
}
