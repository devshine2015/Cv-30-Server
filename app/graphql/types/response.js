module.exports = `
    type LoginResponse {
        token: String
        refreshToken: String
        error: String
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