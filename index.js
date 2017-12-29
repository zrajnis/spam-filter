module.exports = function (classifierName = 'naiveBayes') {
  try {
    return init(classifierName)
  } catch (e) {
    const error = new Error('Invalid initialization')
    error.code = 'EACCES'
    throw error
  }
}

function genericInit (classifier) {
  return {
    classify: function (item) {
      return classifier.classify(item)
    },
    empty: function () {
      return classifier.empty()
    },
    isSpam: function (item) {
      return classifier.classify(item) === 'bad'
    },
    generate: function () {
      return classifier.generate()
    },
    train: function (item, cat) {
      return classifier.train(item, cat)
    },
    trainSet: function (arr) {
      return classifier.trainSet(arr)
    },
  }
}

function init (classifierName) {
  const classifier = require(`./${classifierName}`)

  if (classifierName === 'fisher') {
    return Object.assign(genericInit(classifier), {
      getMinimum: function (cat) {
        return classifier.getMinimum(cat)
      },
      setMinimum: function (cat, t) {
        return classifier.setMinimum(cat, t)
      },
    })
  }
  return Object.assign(genericInit(classifier), {
    getThreshold: function (cat) {
      return classifier.getThreshold(cat)
    },
    setThreshold: function (cat, t) {
      return classifier.setThreshold(cat, t)
    },
  })
}
