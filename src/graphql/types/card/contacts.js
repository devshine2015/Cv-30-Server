import Scalars from '../scalars';

const Contact = `
    type CardContact {
        id: Int
        order: Int!
        type: ContactType!
        content: String!
    }
    input CardContactInput {
        id: Int
        order: Int!
        type: ContactType!
        content: String!
    }
`;

export default () => [Contact];