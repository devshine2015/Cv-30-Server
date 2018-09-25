const yup = require('yup');

module.exports = {
    all: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        first: yup.number().positive().integer().moreThan(1).required(),
        after: yup.string().trim().matches(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/i).max(1024)
    }),
    one: yup.object().shape({
        id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    input: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        details: yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            name: yup.string().trim().max(255),
            headline: yup.string().trim().max(255),
            description: yup.string().trim(),
            activityField: yup.string().trim().max(255),
            noOfEmployees: yup.string().trim().max(255),
            location: yup.string().trim().max(255),
            hasCover: yup.boolean(),
            coverContentType: yup.string().matches(/(jpeg|png|gif)/, { excludeEmptyString: true }).nullable(),
            coverPath: yup.string().max(2048).nullable(),
            coverBackground: yup.string().trim().max(4096).nullable(),
            hasLogo: yup.boolean(),
            logoContentType: yup.string().matches(/(jpeg|png|gif)/, { excludeEmptyString: true }).nullable(),
            logoPath: yup.string().max(2048).nullable(),
            industryId: yup.number().integer().positive(),
        })
    }),
    faqInput: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        details: yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
            question: yup.string().trim(),
            answer: yup.string().trim(),
            remove: yup.boolean()
        }).required()
    }),
    tags: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        tagsInput: yup.object().shape({
            companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
            tags: yup.array().of(
                yup.string().trim()
                    .required('Tag needs a title')
                    .max(100, 'Tag title cannot be longer than 100 chars')
            )
        })
    }),
    removeTag: yup.object().shape({
        id: yup.number().required(),
        companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required()
    })
};