const yup = require('yup');

module.exports = {
    all: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true })
    }),
    newsFeedArticles: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        peopleOrCompany: yup.string().trim().max(1024),
        tags: yup.array().of(yup.string().trim().max(255).required()),
        first: yup.number().positive().integer().moreThan(1).required(),
        after: yup.string().trim().matches(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/i).max(108).min(108)
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
        first: yup.number().positive().integer().moreThan(1).required(),
        after: yup.string().trim().matches(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/i).max(108).min(108)
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
            postAs: yup.string().matches(/(profile|company|team|landingPage)/, { excludeEmptyString: true }),
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
            tags: yup.array().of(yup.string().trim().max(255).required()),
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
    removeArticle: yup.object().shape({
        id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required()
    }),
    appreciate: yup.object().shape({
        tagId: yup.number().integer().required(),
        articleId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required()
    }),
    handleArticleTags: yup.object().shape({
        language: yup.string().required().matches(/(en|ro)/, { excludeEmptyString: true }),
        titles: yup.array().of(yup.string().trim().max(255).required()).required(),
        articleId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required()
    })
}