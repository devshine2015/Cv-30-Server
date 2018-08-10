const Article = require('./article');
const Skill = require('./skill');
const Value = require('./value');
const Experience = require('./experience');
const Project = require('./project');
const Contact = require('./contact');
const Salary = require('./salary');
const Story = require('./story');

const Profile = `
    type Profile {
        id: String
        email: String
        firstName: String
        lastName: String
        featuredArticles: [Article]
        aboutMeArticles: [Article]
        skills: [Skill]
        values: [Value]
        experience: [Experience]
        projects: [Project]
        contact: Contact
        hasAvatar: Boolean
        avatarContentType: ImageType
        hasProfileCover: Boolean
        profileCoverContentType: ImageType
        coverBackground: String
        currentPosition: CurrentPosition
        story: Story
        salary: Salary
        errors: [Error]
        followers: [User]
        followees: [User]
        followingCompanies: [Company]
        followingTeams: [Team]
        followingJobs: [Job]
        appliedJobs: [Job]
        ownedCompanies: [Company]
    }
    type CurrentPosition {
        experience: Experience
        project: Project
    }
`;

module.exports = () => [Profile, Story, Salary, Contact, Skill, Value, Article, Experience, Project];

