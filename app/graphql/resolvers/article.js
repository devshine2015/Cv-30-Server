const uuid = require('uuidv4');
const { merge } = require('lodash');
const schema = require('../validation');
const { checkUserAuth, yupValidation, throwForbiddenError, getLanguageByCode, getLanguageIdByCode, validateCompany } = require('./common');

const handleArticle = async (language, article, options, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.article.input, {
        language,
        article,
        options
    });

    if (article && article.id) {
        await validateArticle(article.id, user, models);
    }

    if (options) {
        if (options.articleId) {
            await validateArticle(options.articleId, user, models);
        }

        if (options.companyId) {
            const companyOk = await validateCompany(options.companyId, user, models);
            if (companyOk !== true) return companyOk;
        }

        if (options.teamId) {
            const foundTeam = await models.team.findOne({
                attributes: ["id"], 
                where: { id: options.teamId },
                include: [
                    { association: 'company', attributes: ["id", "ownerId"] }
                ]
            });
            if (!foundTeam) return { status: false, error: 'Team not found' }
            if (foundTeam.company.ownerId != user.id) throwForbiddenError();
        }
    }

    language = await getLanguageByCode(models, language);

    let result = false;
    await models.sequelize.transaction(async t => {
        if (article) {
            article.id = article.id || uuid();
            article.ownerId = user.id;
            await models.article.upsert(article, { transaction: t });
            article.articleId = article.id;
            article.languageId = language.id;
            if (article.images && article.images.length > 0) {
                await models.image.bulkCreate(article.images.map(item => ({
                    id: item.id,
                    userId: user.id,
                    isFeatured: item.isFeatured,
                    sourceId: article.id,
                    sourceType: item.sourceType,
                    target: item.target,
                    path: item.path
                })), {
                        updateOnDuplicate: ["isFeatured", "path"],
                        transaction: t
                    });
                await models.imageText.bulkCreate(article.images.map(item => ({
                    imageId: item.id,
                    title: item.title,
                    description: item.description,
                    languageId: language.id
                })), {
                        updateOnDuplicate: ["title", "description"],
                        transaction: t
                    });
            }

            if (article.videos && article.videos.length > 0) {
                await models.video.bulkCreate(article.videos.map(item => ({
                    id: item.id,
                    userId: user.id,
                    isFeatured: item.isFeatured,
                    sourceId: article.id,
                    sourceType: item.sourceType,
                    path: item.path
                })), {
                        updateOnDuplicate: ["isFeatured", "path"],
                        transaction: t
                    });
                await models.videoText.bulkCreate(article.videos.map(item => ({
                    videoId: item.id,
                    title: item.title,
                    description: item.description,
                    languageId: language.id
                })), {
                        updateOnDuplicate: ["title", "description"],
                        transaction: t
                    });
            }
            if (!!article.title || !!article.description) {
                if (article.title) {
                    let newSlug = slugify(article.title);
                    let newSlugBad = true;
                    while (newSlugBad) {
                        const existingArticleText = await models.articleText.findOne({ attributes: ["articleId", "slug"], where: { slug: newSlug }}, { transaction: t });
                        if (!existingArticleText || existingArticleText.articleId === article.articleId) {
                            newSlugBad = false;
                        } else {
                            newSlug = slugify(`${article.title} ${new Date().getTime()}`);
                        }
                    }
                    article.slug = newSlug;
                }
                await models.articleText.upsert(article, { transaction: t });
            }
        }
        if (options && options.articleId && options.companyId) {
            article = await models.article.findOne({ attributes: ["id"], where: { id: options.articleId }, transaction: t });
            const company = await models.company.findOne({ attributes: ["id"], where: { id: options.companyId }, transaction: t });
            if (options.isFeatured) {
                await company.addFeaturedArticle(article, { transaction: t });
            } else {
                await company.removeFeaturedArticle(article, { transaction: t });
            }
            if (options.isAtOffice) {
                await company.addOfficeArticle(article, { transaction: t });
            } else {
                await company.removeOfficeArticle(article, { transaction: t });
            }
            if (options.isMoreStories) {
                await company.addStoriesArticle(article, { transaction: t });
            } else {
                await company.removeStoriesArticle(article, { transaction: t });
            }
        }
        if (options && options.articleId && options.teamId) {
            article = await models.article.findOne({ attributes: ["id"], where: { id: options.articleId }, transaction: t });
            const team = await models.team.findOne({ attributes: ["id"], where: { id: options.teamId }, transaction: t });
            if (options.isAtOffice) {
                await team.addOfficeArticle(article, { transaction: t });
            } else {
                await team.removeOfficeArticle(article, { transaction: t });
            }
        }
        result = true;
    });

    return { status: result };
}

const article = async (id, language, { models }) => {
    yupValidation(schema.article.one, { id, language });

    return models.article.findOne({
        where: { id },
        ...includeForFind(await getLanguageIdByCode(models, language))
    }).then(mapArticle);
}

const all = async (language, { models }) => {
    yupValidation(schema.article.all, { language });
    return models.article.findAll({
        where: {},
        ...includeForFind(await getLanguageIdByCode(models, language))
    }).then(mapArticles);
}

const newsFeedAll = async (language, { user, models }) => {
    yupValidation(schema.article.all, { language });

    const languageId = await getLanguageIdByCode(models, language);

    if (user) {
        const userFollowees = await models.user.find({
            where: {
                id: user.id
            },
            include: [
                {
                    association: 'followees',
                    attributes: ['id']
                }
            ]
        }).then(u => u ? u.get().followees.map(i => i.id) : []);
    
        let followingArticles = [];
        if (userFollowees && userFollowees.length > 0) {
            followingArticles = await models.article.findAll(merge(
                { 
                    ...includeForFind(languageId)
                },
                {
                    include: [
                        {
                            association: 'author',
                            include: [
                                { 
                                    association: 'followers',
                                    where: { id: user.id}
                                },
                                { association: 'profile' }
                            ],
                            required: true
                        }
                    ],
                    order: [ [ 'createdAt', 'desc' ] ]
                }
            )).then(mapArticles);
        }
    
        const notFollowingArticles = await models.article.findAll({
            where: {
                ownerId: { [models.Sequelize.Op.notIn]: [...userFollowees, user.id] },
            },
            ...includeForFind(languageId),
            order: [ [ 'createdAt', 'desc' ] ]
        }).then(mapArticles);
        
        return {
            following: followingArticles,
            others: notFollowingArticles
        }
    } else {
        return {
            following: models.article.findAll({
                where: {},
                ...includeForFind(languageId),
                order: [ [ 'createdAt', 'desc' ] ]
            }).then(mapArticles)
        }
    }
}

const mapArticles = articles => articles.map(mapArticle);

const mapArticle = article => ({
    ...article.get(),
    author: {
        ...article.author.get(),
        ...article.author.profile.get()
    }
});

const includeForFind = (languageId) => {
    return {
        include: [
            {
                association: 'author',
                include: [
                    { association: 'profile' }
                ]
            },
            { association: 'i18n', where: { languageId } },
            { association: 'images' },
            { association: 'videos' },
            { association: 'featuredImage' }
        ]
    };
}

const validateArticle = async (id, user, models) => {
    const foundArticle = await models.article.findOne({ attributes: ["id", "ownerId"], where: { id } });
    if (foundArticle && foundArticle.ownerId != user.id) throwForbiddenError();
}

module.exports = {
    Query: {
        articles: (_, { language }, context) => all(language, context),
        article: (_, { id, language }, context) => article(id, language, context),
        newsFeedArticles: (_, { language }, context) => newsFeedAll(language, context),
    },
    Mutation: {
        handleArticle: (_, { language, article, options }, context) => handleArticle(language, article, options, context)
    }
};

function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
};