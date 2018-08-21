const yup = require('yup');

module.exports = {
    all: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
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
            place: yup.object().shape({
                addressComponents: yup.string().trim().nullable(),
                formattedAddress: yup.string().trim().nullable(),
                latitude: yup.number().nullable(),
                longitude: yup.number().nullable(),
                international_phone_number: yup.string().trim().nullable(),
                name: yup.string().trim().nullable(),
                placeId: yup.string().trim().nullable(),
                compoundCode: yup.string().trim().nullable(),
                globalCode: yup.string().trim().nullable(),
                rating: yup.number().nullable().min(0).max(5),
                reviews: yup.string().trim().nullable(),
                types: yup.string().trim().nullable(),
                googleUrl: yup.string().trim().nullable(),
                website: yup.string().trim().nullable()
            }),
            hasCover: yup.boolean(),
            coverContentType: yup.string().matches(/(jpeg|png|gif)/, { excludeEmptyString: true }).nullable(),
            coverPath: yup.string().max(2048).nullable(),
            coverBackground: yup.string().trim().max(4096).nullable(),
            hasLogo: yup.boolean(),
            logoContentType: yup.string().matches(/(jpeg|png|gif)/, { excludeEmptyString: true }).nullable(),
            logoPath: yup.string().max(2048).nullable()
        })
    }),
    faqInput: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        details: yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
            question: yup.string().trim(),
            answer: yup.string().trim(),
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