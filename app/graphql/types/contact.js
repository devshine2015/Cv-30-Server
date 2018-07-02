const Contact = `
    type Contact {
        phone: String
        email: String
        facebook: String
        linkedin: String
    }
    input ContactInput {
        phone: String
        email: String
        facebook: String
        linkedin: String
    }
`;

module.exports = () => [Contact];