module.exports = `
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
        avatarPath: String
        hasProfileCover: Boolean
        profileCoverContentType: ImageType
        coverPath: String
        coverBackground: String
        currentPosition: CurrentPosition
        position: String
        story: Story
        salary: Salary
        errors: [Error]
        followers: [Profile]
        followees: [Profile]
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

