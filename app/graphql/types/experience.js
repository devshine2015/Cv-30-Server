const Scalars = require('./scalars');

const Experience = `
    type Experience {
        id: String
        position: String
        company: String
        description: String
        startDate: Date
        endDate: Date
        stillWorkThere: Boolean
    }
`;

module.exports = () => [Experience];