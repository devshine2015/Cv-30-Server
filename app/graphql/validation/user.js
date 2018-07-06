const yup = require('yup');

module.exports = {
    all: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    one: yup.object().shape({
        id: yup.string().trim().nullable().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).notRequired(),
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    settings: yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        oldPassword: yup.string(),
        newPassword: yup.string().when('oldPassword', {
            is: oldPassword => oldPassword.trim() !== "",  // alternatively: (val) => val == true
            then: yup.string().required().min(4).max(30),
            otherwise: yup.string().notRequired().min(0)
        })
    }),
    salary: yup.object().shape({
        amount: yup.number().positive().required(),
        currency: yup.string().required().matches(/(ron|eur)/, { excludeEmptyString: true }),
        isPublic: yup.boolean().required()
    }),
    story: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        title: yup.string().required(),
        description: yup.string().required()
    }),
    values: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        values: yup.array().of(
            yup.string().trim()
                .required('Value needs a title')
                .max(100, 'Value title cannot be longer than 100 chars')
        )
    }),
    skills: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        skills: yup.array().of(
            yup.string().trim()
                .required('Skill needs a title')
                .max(100, 'Skill title cannot be longer than 100 chars')
        )
    }),
    contact: yup.object().shape({
        phone: yup.string().trim()
            .max(255, 'Contact phone cannot be longer than 255 chars'),
        email: yup.string().trim()
            .email()
            .max(255, 'Contact email cannot be longer than 255 chars'),
        fb: yup.string().trim()
            .url()
            .max(255, 'Contact facebook cannot be longer than 255 chars'),
        linkedin: yup.string().trim()
            .url()
            .max(255, 'Contact linkedin cannot be longer than 255 chars'),
    }),
    project: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        location: yup.number(),
        isCurrent: yup.boolean(),
        position: yup.string()
            .max(255, 'Project position cannot be longer than 255 chars'),
        company: yup.string()
            .max(255, 'Project company cannot be longer than 255 chars'),
        startDate: yup.date().required(),
        endDate: yup.date().nullable(),
        title: yup.string().trim()
            .max(255, 'Project title cannot be longer than 255 chars')
            .nullable(),
        description: yup.string().nullable()
    }),
    experience: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        location: yup.number(),
        isCurrent: yup.boolean(),
        position: yup.string()
            .max(255, 'Experience position cannot be longer than 255 chars'),
        company: yup.string()
            .max(255, 'Experience company cannot be longer than 255 chars'),
        startDate: yup.date().required(),
        endDate: yup.date().nullable(),
        title: yup.string().trim()
            .max(255, 'Experience title cannot be longer than 255 chars')
            .nullable(),
        description: yup.string().nullable()
    })
};