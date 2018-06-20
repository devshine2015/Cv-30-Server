const Error = `
    type Error {
        name: String
        value: String
        statusCode: Int
    }
`;

module.exports = () => [Error];