const naiveBayes = require('./naiveBayes')

module.exports = {
  classify: function (item) {
    return naiveBayes.classify(item)
  },
  isSpam: function (item) {
    return naiveBayes.classify(item) === 'bad'
  },
  generate: function () {
    return naiveBayes.generate()
  },
  getThreshold: function (cat) {
    return naiveBayes.getThreshold(cat)
  },
  setThreshold: function (cat, t) {
    return naiveBayes.setThreshold(cat, t)
  },
  train: function (item, cat) {
    return naiveBayes.train(item, cat)
  },
}
