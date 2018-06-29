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
`;

const ExperienceText = `
    type ExperienceText {
        title: String
        description: String
    }
`;

module.exports = () => [Experience, ExperienceText];