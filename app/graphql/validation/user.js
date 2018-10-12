const yup = require('yup');

module.exports = {
    all: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        filter: yup.object().shape({
            name: yup.string().trim().max(255),
            location: yup.string().trim().max(255),
            skills: yup.array().of(yup.number().positive().integer()),
            values: yup.array().of(yup.number().positive().integer()),
            companyName: yup.string().trim().max(255),
            isProfileVerified: yup.boolean()
        }),
        first: yup.number().positive().integer().moreThan(1).required(),
        after: yup.string().trim().matches(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/i).max(1024)
    }),
    one: yup.object().shape({
        id: yup.string().trim().nullable().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).notRequired(),
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    setAvatar: yup.object().shape({
        status: yup.boolean(),
        contentType: yup.string().matches(/(jpeg|png|gif)/, { excludeEmptyString: true }).nullable(),
        path: yup.string().max(2048).nullable()
    }),
    setProfileCover: yup.object().shape({
        status: yup.boolean(),
        contentType: yup.string().matches(/(jpeg|png|gif)/, { excludeEmptyString: true }).nullable(),
        path: yup.string().max(2048).nullable()
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
            yup.number().positive().integer()
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
        location: yup.string().trim().max(255).required('Please enter a location'),
        isCurrent: yup.boolean(),
        position: yup.string()
            .max(255, 'Experience position cannot be longer than 255 chars')
            .required(),
        company: yup.string()
            .required('Company cannot be null')
            .max(255, 'Experience company cannot be longer than 255 chars'),
        startDate: yup.date().required('Please provide a start date.'),
        endDate: yup.date().when('isCurrent', {
            is: true,
            then: yup.date().oneOf([undefined, null], "Cannot be current and set end date."),
            otherwise: yup.date().required('Please select an end date.')
        }),
        title: yup.string().trim()
            .max(255, 'Project title cannot be longer than 255 chars')
            .nullable(),
        description: yup.string().nullable(),
        images: yup.array().of(yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            isFeatured: yup.boolean(),
            source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team|experience|project|education|hobby)/, { excludeEmptyString: true }),
            path: yup.string().trim().max(255)
        })),
        videos: yup.array().of(yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            isFeatured: yup.boolean(),
            source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team|experience|project|education|hobby)/, { excludeEmptyString: true }),
            path: yup.string().trim().max(255)
        }))
    }),
    experience: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        location: yup.string().trim().max(255).required('Please enter a location'),
        isCurrent: yup.boolean(),
        position: yup.string()
            .max(255, 'Experience position cannot be longer than 255 chars')
            .required(),
        company: yup.string()
            .required('Company cannot be null')
            .max(255, 'Experience company cannot be longer than 255 chars'),
        startDate: yup.date().required('Please provide a start date.'),
        endDate: yup.date().when('isCurrent', {
            is: true,
            then: yup.date().oneOf([undefined, null], "Cannot be current and set end date."),
            otherwise: yup.date().required('Please select an end date.')
        }),
        title: yup.string().trim()
            .max(255, 'Experience title cannot be longer than 255 chars')
            .nullable(),
        description: yup.string().nullable(),
        images: yup.array().of(yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            isFeatured: yup.boolean(),
            source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team|experience|project|hobby|education)/, { excludeEmptyString: true }),
            path: yup.string().trim().max(255)
        })),
        videos: yup.array().of(yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            isFeatured: yup.boolean(),
            source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team|experience|project|education|hobby)/, { excludeEmptyString: true }),
            path: yup.string().trim().max(255)
        }))
    }),
    education: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        location: yup.string().trim().max(255).required('Please enter a location'),
        isCurrent: yup.boolean(),
        position: yup.string()
            .max(255, 'Education position cannot be longer than 255 chars')
            .required(),
        company: yup.string()
            .required('Company cannot be null')
            .max(255, 'Education company cannot be longer than 255 chars'),
        startDate: yup.date().required('Please provide a start date.'),
        endDate: yup.date().when('isCurrent', {
            is: true,
            then: yup.date().oneOf([undefined, null], "Cannot be current and set end date."),
            otherwise: yup.date().required('Please select an end date.')
        }),
        title: yup.string().trim()
            .max(255, 'Education title cannot be longer than 255 chars')
            .nullable(),
        description: yup.string().nullable(),
        images: yup.array().of(yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            isFeatured: yup.boolean(),
            source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team|experience|project|education|hobby)/, { excludeEmptyString: true }),
            path: yup.string().trim().max(255)
        })),
        videos: yup.array().of(yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            isFeatured: yup.boolean(),
            source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team|experience|project|education|hobby)/, { excludeEmptyString: true }),
            path: yup.string().trim().max(255)
        }))
    }),
    hobby: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        location: yup.string().trim().max(255).required('Please enter a location'),
        isCurrent: yup.boolean(),
        position: yup.string()
            .max(255, 'Hobby position cannot be longer than 255 chars')
            .required(),
        company: yup.string()
            .required('Company cannot be null')
            .max(255, 'Hobby company cannot be longer than 255 chars'),
        startDate: yup.date().required('Please provide a start date.'),
        endDate: yup.date().when('isCurrent', {
            is: true,
            then: yup.date().oneOf([undefined, null], "Cannot be current and set end date."),
            otherwise: yup.date().required('Please select an end date.')
        }),
        title: yup.string().trim()
            .max(255, 'Hobby title cannot be longer than 255 chars')
            .nullable(),
        description: yup.string().nullable(),
        images: yup.array().of(yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            isFeatured: yup.boolean(),
            source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team|experience|project|education|hobby)/, { excludeEmptyString: true }),
            path: yup.string().trim().max(255)
        })),
        videos: yup.array().of(yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            isFeatured: yup.boolean(),
            source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team|experience|project|education|hobby)/, { excludeEmptyString: true }),
            path: yup.string().trim().max(255)
        }))
    }),
    handleFollow: yup.object().shape({
        userToFollowId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
        companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
        jobId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
        teamId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
        isFollowing: yup.boolean().required()
    }),
    setPosition: yup.object().shape({
        position: yup.string().trim().max(255).nullable()
    }),
    setCVFile: yup.object().shape({
        cvFile: yup.string().trim().max(255).nullable()
    })
};