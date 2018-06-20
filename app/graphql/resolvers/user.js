
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

const setAvatar = (status, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    if (errors.length) throw new Error(errors);
    // user.profile.has_avatar = status;
    // if (user.profile.save()) {
    if (models.profile.upsert({ userId: user.id, hasAvatar: status })) {
        return {
            status: true,
            error: ""
        };
    } else {
        return {
            status: false,
            error: "We did not manage to store your profile picture"
        };
    }
}

module.exports = {
    profile,
    setAvatar
};