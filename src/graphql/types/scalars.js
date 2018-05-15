export default `
    scalar Date
    enum LanguageCodeType {
        en
    }
    enum UserStatus {
        active
        pending
        suspended
        deleted
    }
    enum ContactType {
        phone
        email
    }
    enum ImageType {
        jpeg
        png
    }
    enum SocialType {
        url
        facebook
        twitter
        instagram
    }
    enum TextLocationType {
        front
        back
    }
`;