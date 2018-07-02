const Story = `
    type Story {
        i18n: [StoryText]
    }
    input StoryInput {
        title: String
        description: String
    }
`;

const StoryText = `
    type StoryText {
        title: String
        description: String
    }
`;

module.exports = () => [Story, StoryText];