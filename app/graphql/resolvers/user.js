
const profile = async (id, language, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });
        return errors;
    }
    user = await models.user.findOne({
        where: {
            id: user
        }
    });
}

module.exports = {
    profile
};