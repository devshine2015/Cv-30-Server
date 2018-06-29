const yup = require('yup');

module.exports = {
    values: yup.object().shape({
        language: yup.string().required(),
        values: yup.array().of(
            yup.string().trim()
            .required('Value needs a title')
            .max(100, 'Value title cannot be longer than 100 chars')
        )
    }),
    skills: yup.object().shape({
        language: yup.string().required(),
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
        location: yup.number(),
        isCurrent: yup.boolean(),
        position: yup.string()
            .max(255, 'Project position cannot be longer than 255 chars'),
        company: yup.string()
            .max(255, 'Project company cannot be longer than 255 chars'),
        startDate: yup.date(),
        endDate: yup.date()
    }),
    experience: yup.object().shape({
        location: yup.number(),
        isCurrent: yup.boolean(),
        position: yup.string()
            .max(255, 'Experience position cannot be longer than 255 chars'),
        company: yup.string()
            .max(255, 'Experience company cannot be longer than 255 chars'),
        startDate: yup.date(),
        endDate: yup.date()
    })
};