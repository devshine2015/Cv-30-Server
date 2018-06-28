const Scalars = require('./scalars');

const Project = `
    type Project {
        id: String
        position: String
        company: String
        description: String
        startDate: Date
        endDate: Date
        isCurrent: Boolean
    }
`;

module.exports = () => [Project];