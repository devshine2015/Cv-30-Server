const glob = require('glob');
const path = require('path');

const Query = `
	type Query {
		_empty: String
	}
	type Mutation {
		_empty: String
	}
`;

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
	Query,
	...allTypes()
];