const yup = require('yup');

module.exports = {
    handleShallowUser: yup.object().shape({
        shallowUser: yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            firstName: yup.string().trim().max(255).required(),
            lastName: yup.string().trim().max(255).required(),
            email: yup.string().trim().email().max(255, 'Email cannot be longer than 255 chars').required(),
            position: yup.string().trim().max(255),
            avatarPath: yup.string().trim().max(512).nullable(),
            description: yup.string().trim().max(2048).nullable()
        }).default(undefined),
        options: yup.object().shape({
            shallowUserId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
            teamId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
            isMember: yup.boolean()
        }).default(undefined)
    })
}