
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
    let result = {
        ...user.get(),
        ...user.profile.get()
    };

    return result;
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

const setHasProfileCover = (status, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    if (errors.length) throw new Error(errors);
    if (models.profile.upsert({ userId: user.id, hasProfileCover: status })) {
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

const setCoverBackground = (coverBackground, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    if (errors.length) throw new Error(errors);
    if (models.profile.upsert({ userId: user.id, coverBackground })) {
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
    setAvatar,
    setHasProfileCover,
    setCoverBackground
};