const skills = async ({ models }) => {
    return models.skill.findAll({});
}

module.exports = {
    Query: {
        skills: (_, { }, context) => skills(context)
    }
}