const glob = require('glob');
const path = require('path');

const createValidationSchema = () => {
	const files = glob.sync(`${__dirname}/!(*.test|index|common).js`);
	return files.map(file => ({
        [path.basename(file, '.js')]: require(`./${path.basename(file, '.js')}`)
    })).reduce((acc, item) => ({
        ...acc,
        ...item
    }), {});
}

module.exports = createValidationSchema();