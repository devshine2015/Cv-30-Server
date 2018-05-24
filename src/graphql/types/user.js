import Scalars from './scalars';

const User = `
	type User {
    	id: Int!
        uid: String!
        email: String!
        status: UserStatus!
        nickname: String!
        firstName: String
        lastName: String
        updatedAt: Date!
        createdAt: Date!
  	}
`;

export default () => [User, Scalars];