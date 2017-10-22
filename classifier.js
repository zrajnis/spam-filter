const _ = require('lodash')
const fs = require('fs')
const path = require('path')

let classifier = require('./dataSet')

classifier.catCount = function (cat) {
  return this.cc[cat] ? this.cc[cat] : 0
}

classifier.ftrCount = function (ftr, cat) {
  return this.fc[ftr] && this.fc[ftr][cat] ? this.fc[ftr][cat] : 0
}

classifier.ftrProb = function (ftr, cat) {
  return this.catCount(cat) === 0 ? 0 : this.ftrCount(ftr, cat) / this.catCount(cat)
}

classifier.generate = function () {
  this.init()

  const text = fs.readFileSync(path.resolve(__dirname, 'dataSet.txt'), 'utf-8').split(/\n/)
  const formatted = _.each(text, function(line) {
    const splitLine = line.split(/\t/)
    if (splitLine[0] && splitLine[1]) {
      classifier.train(splitLine[1], splitLine[0])
    }
  })

  const newText = `module.exports = ${JSON.stringify(classifier, null, 2)}`

  try {
    fs.writeFileSync(path.resolve(__dirname, 'dataSet.js'), newText)
    this.init(require('./dataSet'))
    console.log('Generated data set as dataSet.js.');
    return
  } catch (e) {
    return console.log(e)
  }
}

classifier.getCategories = function () {
  return _.keys(this.cc)
}

classifier.getFeatures = function (text) {
  const words = _.map(text.match(/[a-z0-9\-]+/gi), _.toLower)

  return words
}

classifier.getThreshold = function (cat) {
  return this.thresholds[cat] ? this.thresholds[cat] : 1
}

classifier.incCat = function (cat) {
  this.cc[cat] = this.cc[cat] ? this.cc[cat] + 1 : 1
}

classifier.init = function (newClassifier) {
  return _.assign(classifier, {
      fc: newClassifier ? newClassifier.fc : {},
      cc: newClassifier ? newClassifier.cc :{},
      thresholds: {},
    })
}

classifier.incFtr = function (ftr,cat) {
  if (!this.fc[ftr]) {
    this.fc[ftr] = {}
  }
  this.fc[ftr][cat] = this.fc[ftr][cat] ? this.fc[ftr][cat] + 1 : 1
}

classifier.sampleTrain = function () {
  this.train('Nobody owns the water.', 'good')
  this.train('the quick rabbit jumps123 5213 fences', 'good')
  this.train('buy pharmaceuticals now', 'bad')
  this.train('make quick money at the online casino', 'bad')
  this.train('the quick brown fox jumps', 'good')
}

classifier.save = function () {
  const text = `module.exports = ${JSON.stringify(classifier, null, 2)}`

  try {
    fs.writeFileSync(path.resolve(__dirname, 'dataSet.js'), text)
    this.init(require('./dataSet'))
    console.log('Data set saved.');
    return
  } catch (e) {
    return console.log(e);
  }

}

classifier.setThreshold = function (cat, t) {
  this.thresholds[cat] = t
}

classifier.totalCount = function () {
  return _.reduce(this.cc, function (result, value) {
    return result + value
  }, 0)
}

classifier.train = function (item, cat, saveFlag = false) {
  _.map(this.getFeatures(item), function (feature) {
    return classifier.incFtr(feature, cat)
  })

  this.incCat(cat)

  if (saveFlag) {
    this.save()
  }
}

classifier.weightedProb = function (ftr, cat, weight = 1, assumedProb = 0.5) {
  const basicProb = this.ftrProb(ftr, cat)
  const totals = _.reduce(this.getCategories(), function (result, category) {
    return result + classifier.ftrCount(ftr, category)
  }, 0)

  return ((weight * assumedProb) + (totals * basicProb)) / (weight + totals)
}

module.exports = classifier
