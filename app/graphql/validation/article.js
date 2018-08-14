const yup = require('yup');

module.exports = {
    all: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    feed: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        userId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
        companyId: yup.string().when('userId', {
            is: (uid) => !uid,
            then: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            otherwise: yup.string().oneOf([undefined, null], "Only one of userId, companyId, teamId can bemerg set")
        }),
        teamId: yup.string().when(['userId', 'companyId'], {
            is: (uid, cid) => !uid && !cid,
            then: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            otherwise: yup.string().oneOf([undefined, null], "Only one of userId, companyId, teamId can be set")
        }),
    }),
    one: yup.object().shape({
        id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    handleArticle: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        article: yup.object().shape({
            id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            isFeatured: yup.boolean(),
            isPost: yup.boolean(),
            postAs: yup.string().matches(/(profile|company|team)/, { excludeEmptyString: true }),
            postingCompanyId: yup.string().when('postAs', {
                is: (postAs) => postAs === "company",
                then: yup.string()
                    .trim()
                    .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
                    .required("postingCompanyId is required when postAs is company"),
                otherwise: yup.string().oneOf([undefined], "postingCompanyId is not allowed when postAs is not company")
            }),
            postingTeamId: yup.string().when('postAs', {
                is: (postAs) => postAs === "team",
                then: yup.string()
                    .trim()
                    .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
                    .required("postingTeamId is required when postAs is team"),
                otherwise: yup.string().oneOf([undefined], "postingTeamId is not allowed when postAs is not team")
            }),
            images: yup.array().of(yup.object().shape({
                id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
                title: yup.string().trim().max(255),
                description: yup.string().trim(),
                isFeatured: yup.boolean(),
                source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
                sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team)/, { excludeEmptyString: true }),
                path: yup.string().trim().max(255)
            })),
            videos: yup.array().of(yup.object().shape({
                id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
                title: yup.string().trim().max(255),
                description: yup.string().trim(),
                isFeatured: yup.boolean(),
                source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
                sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team)/, { excludeEmptyString: true }),
                path: yup.string().trim().max(255)
            })),
            title: yup.string().trim().max(255),
            description: yup.string().trim(),
            tags: yup.array().of(yup.string().trim().max(255).required()).min(1),
        }).default(undefined),
        options: yup.object().shape({
            articleId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
            isFeatured: yup.boolean(),
            isAtOffice: yup.boolean(),
            isMoreStories: yup.boolean(),
            teamId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
        })
    }),
    handleArticleTags: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        titles: yup.array().of(yup.string().trim().max(255).required()).required().min(1),
        articleId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required(),
        isSet: yup.boolean()
    })
}