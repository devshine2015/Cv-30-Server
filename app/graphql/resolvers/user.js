
const profile = (id, language, { user, models }) => {
    console.log(user);
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    if (errors.length)
        throw new Error(errors);

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