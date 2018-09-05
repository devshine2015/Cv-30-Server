const yup = require('yup');

module.exports = {
    all: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
    }),
    one: yup.object().shape({
        id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    jobTypes: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    input: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        jobDetails: yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            teamId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            idealCandidate: yup.string().trim(),
            phone: yup.string().trim().max(255),
            email: yup.string().trim().max(255),
            facebook: yup.string().trim().max(255),
            linkedin: yup.string().trim().max(255),
            expireDate: yup.date(),
            location: yup.string().trim().max(255),
            jobTypes: yup.array().of(yup.number().positive().integer()),
            salary: yup.object().shape({
                amountMin: yup.number().positive().required().lessThan(yup.ref('amountMax')),
                amountMax: yup.number().positive().required(),
                currency: yup.string().required().matches(/(ron|eur)/, { excludeEmptyString: true }),
                isPublic: yup.boolean().required()
            }).default(undefined),
            activityField: yup.string().trim().max(255),
            imagePath: yup.string().trim().max(1024).nullable(),
            videoUrl: yup.string().trim().max(1024).nullable(),
            skills: yup.array().of(
                yup.string().trim()
                    .required('Skill needs a title')
                    .max(100, 'Skill title cannot be longer than 100 chars')
            ),
            status: yup.string().matches(/(draft|active|archived)/, { excludeEmptyString: true }),
            jobBenefits: yup.array().of(yup.number().positive().integer()),
        })
    }),
    handleApplyToJob: yup.object().shape({
        jobId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
        isApplying: yup.boolean().required()
    })
};