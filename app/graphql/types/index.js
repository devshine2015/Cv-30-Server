const glob = require('glob');
const path = require('path');

const SchemaDefinition = `
	schema {
		query: Query
		mutation: Mutation
 	}
`;

const allTypes = () => {
	const files = glob.sync(`${__dirname}/!(*.testCases|index).js`);
	return files.map(file => require(`./${path.basename(file, '.js')}`));
} 

module.exports = [
	SchemaDefinition,
	...allTypes()
];