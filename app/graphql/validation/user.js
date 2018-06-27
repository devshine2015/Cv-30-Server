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
};

/*
const yup = require('yup');

module.exports = {
    login: yup.object().shape({
        email: yup.string()
            .trim()
            .required('Please enter your email address')
            .email('Email address is invalid')
            .max(100, 'Email address should be between 1 and 100 characters'),
        password: yup.string()
            .required('Please enter a password')
            .max(30, 'Password should be between 1 and 30 characters')
    }),
    register: yup.object().shape({
        firstName: yup.string()
            .trim()
            .required('Please enter your first name')
            .max(255, 'Email address should be between 1 and 255 characters'),
        lastName: yup.string()
            .trim()
            .required('Please enter your last name')
            .max(255, 'Email address should be between 1 and 255 characters'),
        email: yup.string()
            .trim()
            .required('Please enter your email address')
            .email('Email address is invalid')
            .max(100, 'Email address should be between 1 and 100 characters'),
        password: yup.string()
            .required('Please enter a password')
            .max(30, 'Password should be between 1 and 30 characters')
    }),
};*/