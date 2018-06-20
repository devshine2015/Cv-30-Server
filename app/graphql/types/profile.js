const Scalars = require('./scalars');
const Article = require('./article');
const Skill = require('./skill');
const Value = require('./value');
const Experience = require('./experience');
const Project = require('./project');
const Contact = require('./contact');
const Salary = require('./salary');
const Image = require('./image');
const Error = require('./error');

const Profile = `
    type Profile {
        firstName: String
        lastName: String
        featuredArticles: [Article]
        skills: [Skill]
        values: [Value]
        experience: [Experience]
        projects: [Project]
        contacts: [Contact]
        hasAvatar: Boolean
        hasProfileCover: Boolean
        coverBackground: String
        story: String
        salary: Salary
        errors: [Error]
    }
`;

module.exports = () => [Profile, Salary, Contact, Skill, Value, Article, Experience, Project];

