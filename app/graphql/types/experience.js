const Scalars = require('./scalars');

const Experience = `
    type Experience {
        id: String
        position: String
        company: String
        description: String
        startDate: Date
        endDate: Date
        isCurrent: Boolean,
        i18n: [ExperienceText]
    }
    input ExperienceInput {
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

const ExperienceText = `
    type ExperienceText {
        title: String
        description: String
    }
`;

module.exports = () => [Experience, ExperienceText];