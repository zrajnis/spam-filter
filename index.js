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
  train: function (item, cat) {
    return naiveBayes.train(item, cat, true)
  },
}
