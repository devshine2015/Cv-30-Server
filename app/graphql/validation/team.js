const yup = require('yup');

module.exports = {
    input: yup.object().shape({
        teamDetails: yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            name: yup.string().trim().max(255),
            hasProfileCover: yup.boolean(),
            profileBackgroundColor: yup.string().trim(100)
        })
    })
};
    