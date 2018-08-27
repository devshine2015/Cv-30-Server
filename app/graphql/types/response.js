module.exports = `
    type LoginResponse {
        token: String
        refreshToken: String
        id: String
        email: String
        firstName: String
        lastName: String
        hasAvatar: Boolean
        avatarContentType: ImageType
        avatarPath: String
        error: String
        god: Boolean
    }
    type CheckTokensResponse {
        token: String
        refreshToken: String
        status: Boolean!
        error: String
    }
    type StandardResponse {
        status: Boolean!
        error: String
    }
`;