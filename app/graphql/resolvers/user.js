
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

    return createProfileResponse(user, models);
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
    if (models.profile.upsert({ userId: user.id, hasAvatar: status })) {
        return createProfileResponse(user, models);
    } else {
        return {
            status: false,
            error: "We did not manage to store your profile picture"
        };
    }
}

const setHasProfileCover = async (status, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    console.log(user);
    if (errors.length) throw new Error(errors);
    if (await models.profile.upsert({ userId: user.id, hasProfileCover: status })) {
        return createProfileResponse(user, models);
    } else {
        return {
            status: false,
            error: "We did not manage to store your profile picture"
        };
    }
}

const setCoverBackground = async (color, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }

    if (errors.length) throw new Error(errors);

    if (await models.profile.upsert({ userId: user.id, coverBackground: color })) {
        return createProfileResponse(user, models);
    } else {
        return {
            status: false,
            error: "We did not manage to store your profile picture"
        };
    }
}

const createProfileResponse = async (user, models) => {
    // let profile = user.profile ? await user.profile.get() : {};
    const newUser = await models.user.findOne({
        where: {
            id: user.id
        },
        include: [
            { association: 'skills' },
            { association: 'values' },
            { association: 'profile' },
            { association: 'articles' },
            { association: 'experience' },
            { association: 'projects' },
            { association: 'contact' }
        ]
    });
    /*let result = {
        ...newUser,
        ...profile
    };*/
    // console.log();
    return {
        ...newUser.get(),
        ...newUser.profile.get()
    };
}
/*
User.belongsToMany(models.role, { through: 'user_roles' });
        User.belongsToMany(models.skill, { through: 'user_skills' });
        User.belongsToMany(models.value, { through: 'user_values' });
        User.hasOne(models.profile, { as: 'profile', foreignKey: 'user_id' });
        User.hasMany(models.article, { as: 'articles' });
        User.hasMany(models.experience, { as: 'experiences' });
        User.hasMany(models.project, { as: 'projects' });
        User.hasOne(models.contact, { as: 'contact', foreignKey: 'user_id' });*/
module.exports = {
    profile,
    setAvatar,
    setHasProfileCover,
    setCoverBackground
};