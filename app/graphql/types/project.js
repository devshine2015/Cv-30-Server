const Scalars = require('./scalars');

const Project = `
    type Project {
        id: String
        position: String
        company: String
        description: String
        startDate: Date
        endDate: Date
        isCurrent: Boolean,
        i18n: [ProjectText]
    }
    input ProjectInput {
        id: String
        location: Int
        isCurrent: Boolean
        position: String
        company: String
        startDate: Date
        endDate: Date
        title: String
        description: String
    }
`;

const ProjectText = `
    type ProjectText {
        title: String
        description: String
    }
`;

module.exports = () => [Project, ProjectText];