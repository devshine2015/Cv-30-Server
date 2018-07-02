const yup = require('yup');

module.exports = {
    input: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        jobDetails: yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            idealCandidate: yup.string().trim()
        })
    })
};