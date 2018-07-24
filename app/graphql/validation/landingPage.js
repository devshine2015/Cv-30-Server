const yup = require('yup');

module.exports = {
    one: yup.object().shape({
        // id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    input: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        details: yup.object().shape({
            hasCover: yup.boolean(),
            coverContentType: yup.string().matches(/(jpeg|png|gif)/, { excludeEmptyString: true }).nullable(),
            coverBackground: yup.string().trim(100).nullable(),
            headline: yup.string().trim().max(255)
        })
    })
};