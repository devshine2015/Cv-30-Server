import Scalars from '../scalars';

const Image = `
    type CardImage {
        id: Int
        order: Int!
        filename: String!
        name: String!
        type: ImageType
        width: Float
        height: Float
    }
    input CardImageInput {
        id: Int
        order: Int!
        filename: String!
        name: String!
        type: ImageType
        width: Float
        height: Float
    }
`;

export default () => [Image];