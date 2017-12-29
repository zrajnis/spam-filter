# Spam filter
This spam filter lets you choose between using naive Bayes classifier or Fisher's method.

Data set was downloaded from http://www.dt.fee.unicamp.br/~tiago/smsspamcollection/.

It is also available on http://dcomp.sor.ufscar.br/talmeida/smsspamcollection/.

To set up the filter, all you have to do is install the module, by typing:  
`npm install spam-filter`

## Usage:
```
// Uses naive Bayes classifier
const filter = require('spam-filter')('naiveBayes')

// Naive Bayes classifier provides option to set and get thresholds for categories
filter.setThreshold('bad', 2)
filter.getThreshold('bad') // 2

// Uses Fisher's method
const filter = require('spam-filter')('fisher')

// Fisher's method provides option to set and get minimum values for categories
filter.setMinimum('bad', 0.7)
filter.getMinimum('bad') // 0.7

// Setting both minimums and thresholds saves them to the classifier object

const spamMsg = 'call fox tv for money today!'

// Returns boolean
filter.isSpam(spamMsg) //true

// Returns exact category ('good' or 'bad'), or 'none' if string can't be categorized
filter.classify(spamMsg) // 'bad'

// Generates a classifier object with 5500 text messages categorized, object exists by default
// Use this method only if you have trained the filter and want to reset it to default
filter.generate()

// Empty the classifier data
filter.empty()

// Generating a new object or emptying existing one removes the saved minimums and thresholds

// Train the filter, use category 'good' for non-spam and 'bad' for spam
filter.train(spamMsg, 'bad')

// Train the filter with your own set
// Make sure categories remain 'good' and 'bad' in order for .isSpam() method to work
const arr = [['Lorem ipsum dolor sit amet', 'good'], ['Ius eu impedit repudiandae', 'bad']]
filter.trainSet(arr)
```
