const { checkUserAuth } = require('./common');

const all = async ({ user, models }) => {
    checkUserAuth(user);

    return models.image.findAll({ where: { userId: user.id } });
}

module.exports = {
    Query: {
        images: (_, {}, context) => all(context),
    }
}