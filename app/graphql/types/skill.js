const Skill = `
    type Skill {
        id: Int
        i18n: [SkillText]
    }
`;

const SkillText = `
    type SkillText {
        title: String
    }
`;

module.exports = () => [Skill, SkillText];