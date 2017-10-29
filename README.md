# Spam filter
This spam filter uses naive Bayes classifier.

Data set was downloaded from http://www.dt.fee.unicamp.br/~tiago/smsspamcollection/.

It is also available on http://dcomp.sor.ufscar.br/talmeida/smsspamcollection/.

To set up the filter you all you have to do is download the repo, by typing  
`git clone https://github.com/zrajnis/spam-filter`

## Usage:
```
const filter = require('spam-filter')

const spamMsg = 'call fox tv for money today!'

// Returns boolean
filter.isSpam(spamMsg) //true

// Returns exact category ('good' or 'bad'), or 'none' if string can't be categorized
filter.classify(spamMsg) // 'bad'

// Set threshold for a category
filter.setThreshold('bad', 2)

// Get threshold for a category
filter.getThreshold('bad') // 2

// Generates javaScript object with 5500 text messages categorized, object exists by default
// Use this method only if you have trained the filter and want to reset it to default
filter.generate()

// Empty the classifier data
filter.empty()

// Train the filter, use category 'good' for non-spam and 'bad' for spam
filter.train(spamMsg, 'bad')

// Train the filter with your own set
// Make sure categories remain 'good' and 'bad' in order for .isSpam() method to work
const arr = [['Lorem ipsum dolor sit amet', 'good'], ['Ius eu impedit repudiandae', 'bad']]
filter.trainSet(arr)
```
