const yup = require('yup');

module.exports = {
    ads: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    handleAd: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        details: yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
            image: yup.object().shape({
                id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
                title: yup.string().trim().max(255),
                description: yup.string().trim(),
                isFeatured: yup.boolean(),
                source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
                sourceType: yup.string().matches(/ad/, { excludeEmptyString: true }),
                path: yup.string().trim().max(255)
            }),
            url: yup.string().trim().max(1024).required()
        })
    })
};