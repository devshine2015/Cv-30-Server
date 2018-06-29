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
`;

const ProjectText = `
    type ProjectText {
        title: String
        description: String
    }
`;

module.exports = () => [Project, ProjectText];