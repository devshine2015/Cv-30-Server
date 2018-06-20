
const profile = (id, language, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });
        return errors;
    }
    return models.user.findOne({
        where: {
            id: user
        },
        include: [
            { model: models.profile, as: 'profile' }
        ]
    });

}

module.exports = {
    profile
};