const Scalars = require('./scalars');

const Project = `
    type Project {
        id: String
        position: String
        company: String
        location: String
        description: String
        startDate: Date
        endDate: Date
        isCurrent: Boolean,
        i18n: [ProjectText]
        videos: [Video]
        images: [Image]
    }
    input ProjectInput {
        id: String
        location: String
        isCurrent: Boolean
        position: String
        company: String
        startDate: Date
        endDate: Date
        title: String
        description: String
        videos: [VideoInput]
        images: [ImageInput]
    }
`;

const ProjectText = `
    type ProjectText {
        title: String
        description: String
    }
`;

module.exports = () => [Project, ProjectText];