
const profile = (id, language, { user, models }) => {
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
    return user;
    // return models.user.findOne({
    //     where: {
    //         id: user.id
    //     },
    //     include: [
    //         { model: models.profile, as: 'profile' }
    //     ]
    // });

}

module.exports = {
    profile
};