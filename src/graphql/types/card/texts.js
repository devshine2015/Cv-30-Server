import Scalars from '../scalars';

const Text = `
    type CardText {
        id: Int!
        order: Int!
        type: TextLocationType!
        language: LanguageCodeType
        content: String!
    }
    input CardTextInput {
        id: Int
        order: Int!
        type: TextLocationType!
        language: LanguageCodeType
        content: String!
    }
`;

export default () => [Text];