const Scalars = require('./scalars');

const User = `
	type User {
    	id: String!
        email: String!
        status: UserStatus!
        nickname: String!
        firstName: String
        lastName: String
        updatedAt: Date!
        createdAt: Date!
  	}
`;

module.exports = () => [User, Scalars];