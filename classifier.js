const fs = require('fs')
const path = require('path')

let classifier = require('./dataSet')

classifier.catCount = function (cat) {
  return this.cc[cat] ? this.cc[cat] : 0
}

classifier.empty = function () {
  this.init().save()
  return this
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
  const formatted = text.forEach(function (line) {
    const splitLine = line.split(/\t/)
    if (splitLine[0] && splitLine[1]) {
      classifier.train(splitLine[1], splitLine[0], false)
    }
  })

  this.save()
  return this
}

classifier.getCategories = function () {
  return Object.keys(this.cc)
}

classifier.getFeatures = function (text) {
  return text.match(/[a-z0-9\-]+/gi).map(word => word.toLowerCase())
}

classifier.getThreshold = function (cat) {
  return this.thresholds[cat] ? this.thresholds[cat] : 1
}

classifier.incCat = function (cat) {
  this.cc[cat] = this.cc[cat] ? this.cc[cat] + 1 : 1
  return this
}

classifier.init = function (newClassifier) {
  return Object.assign(classifier, {
    fc: newClassifier ? newClassifier.fc : {},
    cc: newClassifier ? newClassifier.cc : {},
    thresholds:  newClassifier ? newClassifier.thresholds : {},
  })
}

classifier.incFtr = function (ftr,cat) {
  if (!this.fc[ftr]) {
    this.fc[ftr] = {}
  }
  this.fc[ftr][cat] = this.fc[ftr][cat] ? this.fc[ftr][cat] + 1 : 1
  return this
}

classifier.save = function () {
  const newText = `module.exports = ${JSON.stringify(this, null, 2)}`

  try {
    fs.writeFileSync(path.resolve(__dirname, 'dataSet.js'), newText)
    this.init(require('./dataSet'))
    return this
  } catch (e) {
    return console.log(e)
  }
}

classifier.setThreshold = function (cat, t) {
  this.thresholds[cat] = t
  return this
}

classifier.totalCount = function () {
  return Object.keys(this.cc).map(key => this.cc[key]).reduce(
    (result, value) => result + value, 0)
}

classifier.train = function (item, cat, saveFlag = true) {
  this.getFeatures(item).map(feature => this.incFtr(feature, cat))
  this.incCat(cat)

  if (saveFlag) {
    this.save()
  }
  return this
}

classifier.trainSet = function (arr) {
  arr.forEach(arrItem => this.train(arrItem[0], arrItem[1], false))
  this.save()
  return this
}

classifier.weightedProb = function (ftr, cat, weight = 1, assumedProb = 0.5) {
  const basicProb = this.ftrProb(ftr, cat)
  const totals = this.getCategories().reduce(
    (result, category) => result + this.ftrCount(ftr, category), 0)

  return ((weight * assumedProb) + (totals * basicProb)) / (weight + totals)
}

module.exports = classifier
