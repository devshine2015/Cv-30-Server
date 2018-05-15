import Scalars from '../scalars';

const Social = `
    type CardSocial {
        id: Int
        order: Int!
        type: SocialType!
        content: String!
    }
    input CardSocialInput {
        id: Int
        order: Int!
        type: SocialType!
        content: String!
    }
`;

export default () => [Social];