const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, throwForbiddenError, validateCompany } = require('./common');

const handleShallowUser = async (shallowUser, options, { user, models }) => {
    console.log("Am intrat");
    checkUserAuth(user);
    yupValidation(schema.shallowUser.handleShallowUser, {
        shallowUser,
        options
    });

    let result = false;
    await models.sequelize.transaction(async t => {
        if (shallowUser) {
            shallowUser.id = shallowUser.id || uuid();
            await models.shallowUser.upsert(shallowUser, { transaction: t });
        }

        if (options) {
            shallowUser = await models.shallowUser.findOne({ attributes: ["id"], where: { id: options.shallowUserId }, transaction: t });
            const team = await models.team.findOne({ attributes: ["id"], where: { id: options.teamId }, transaction: t });
            if (options.isMember) {
                await team.addShallowMember(shallowUser, { transaction: t });
            } else {
                await team.removeShallowMember(shallowUser, { transaction: t });
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