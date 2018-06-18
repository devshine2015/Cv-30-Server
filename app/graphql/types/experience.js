const Scalars = require('./scalars');

const Experience = `
    type Experience {
        position: String
        company: String
        description: String
        startDate: Date
        endDate: Date
        stillWorkThere: Boolean
    }
`;

module.exports = () => [Experience];