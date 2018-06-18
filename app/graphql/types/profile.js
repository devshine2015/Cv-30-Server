const Scalars = require('./scalars');
const Article = require('./article');
const Skill = require('./skill');
const Value = require('./value');
const Experience = require('./experience');
const Project = require('./project');

const Profile = `
    type Profile {
        featuredArticles: [Article]
        skills: [Skill]
        values: [Value]
        experience: [Experience]
        projects: [Project]
        contacts: [String]
        story: String
        isSalaryPublic: Boolean
        desiredSalary: Int
    }
`;

module.exports = () => [Profile, Skill, Value, Article, Experience, Project];