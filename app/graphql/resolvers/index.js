const { merge } = require('lodash');
const glob = require('glob');
const path = require('path');

const allResolvers = () => {
	const files = glob.sync(`${__dirname}/!(*.test|index|common).js`);
	return files.map(file => require(`./${path.basename(file, '.js')}`));
} 

module.exports = merge(allResolvers());