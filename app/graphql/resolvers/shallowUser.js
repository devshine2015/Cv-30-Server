const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation } = require('./common');

const handleShallowUser = async (shallowUser, options, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.shallowUser.handleShallowUser, {
        shallowUser,
        options
    });

    let result = false;
    await models.sequelize.transaction(async transaction => {
        if (shallowUser) {
            shallowUser.id = shallowUser.id || uuid();
            await models.shallowUser.upsert(shallowUser, { transaction });
        }

        if (options) {
            shallowUser = await models.shallowUser.findOne({ attributes: ["id"], where: { id: options.shallowUserId }, transaction });
            const team = await models.team.findOne({ attributes: ["id"], where: { id: options.teamId }, transaction });
            if (options.isMember) {
                await team.addShallowMember(shallowUser, { transaction });
            } else {
                await team.removeShallowMember(shallowUser, { transaction });
            }
        }

        result = true;
    });

    return { status: result };
}

module.exports = {
    Mutation: {
        handleShallowUser: (_, { shallowUser, options }, context) => handleShallowUser(shallowUser, options, context)
    }
};