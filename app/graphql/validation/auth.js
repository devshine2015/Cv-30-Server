const yup = require('yup');

module.exports = {
    settings: yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        oldPassword: yup.string(),
        newPassword: yup.string().when('oldPassword', {
            is: oldPassword => oldPassword && oldPassword.trim() !== "",  // alternatively: (val) => val == true
            then: yup.string().required().min(4).max(30),
            otherwise: yup.string().notRequired().min(0)
        })
    })
};