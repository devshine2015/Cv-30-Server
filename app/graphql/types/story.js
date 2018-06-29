const Story = `
    type Story {
        i18n: [StoryText]
    }
`;

const StoryText = `
    type StoryText {
        title: String
        description: String
    }
`;

module.exports = () => [Story, StoryText];