module.exports = `
    type Skill {
        id: Int
        key: String
    }

    extend type Query {
        skills: [Skill]
    }
`;

`type SkillText {
    title: String
}`;