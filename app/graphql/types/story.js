module.exports = `
    type Story {
        i18n: [StoryText]
    }
    type StoryText {
        title: String
        description: String
    }

    input StoryInput {
        title: String
        description: String
    }
`;