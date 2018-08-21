const uuid = require('uuidv4');
const { merge } = require('lodash');
const schema = require('../validation');
const { checkUserAuth, yupValidation, getLanguageIdByCode, validateCompany, validateTeam, validateArticle } = require('./common');

const handleArticle = async (language, article, options, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.article.handleArticle, {
        language,
        article,
        options
    });

    if (article) {
        if (article.id) {
            const articleOk = await validateArticle(article.id, user, models, {});
            if (articleOk !== true) return articleOk;
        }

        if (article.postingCompanyId) {
            const postingCompanyOk = await validateCompany(article.postingCompanyId, user, models);
            if (postingCompanyOk !== true) return postingCompanyOk;
        }

        if (article.postingTeamId) {
            const postingTeamOk = await validateTeam(article.postingTeamId, user, models);
            if (postingTeamOk !== true) return postingTeamOk;
        }
    }

    if (options) {
        if (options.articleId) {
            const articleOk = await validateArticle(options.articleId, user, models, {});
            if (articleOk !== true) return articleOk;
        }

        if (options.companyId) {
            const companyOk = await validateCompany(options.companyId, user, models);
            if (companyOk !== true) return companyOk;
        }

        if (options.teamId) {
            const teamOk = await validateTeam(options.teamId, user, models);
            if (teamOk !== true) return teamOk;
        }
    }

    const languageId = await getLanguageIdByCode(models, language);

    let result = false;
    await models.sequelize.transaction(async t => {
        if (article) {
            article.id = article.id || uuid();
            article.ownerId = user.id;
            await models.article.upsert(article, { transaction: t });
            article.articleId = article.id;
            article.languageId = languageId;
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
                    languageId
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
                    languageId
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

            if (article.tags) {
                await storeArticleTags(article.tags, article.id, languageId, undefined, user, models, t);
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

const storeArticleTags = async (titles, articleId, languageId, isSet, user, models, transaction) => {
    const cleanedInputTags = titles.map(title => title.trim().toLowerCase());

    // Get data before changes
    const foundUser = await models.user.findOne({
        attributes: ['id'],
        where: {
            id: user.id
        }
    }, { transaction});

    const articleArticleTags = await models.articleArticleTag.findAll({
        attributes: ['id', 'tagId'],
        where: {
            articleId
        },
        include: [
            { association: 'users', attributes: ['id']},
            {
                association: 'tag',
                attributes: ['id'],
                include: [
                    { association: 'i18n', attributes: ['title'], where: { languageId }}
                ]
            }
        ]
    }, { transaction });

    // Start the changes. Find what's new, first.
    const existingTags = await models.articleTag.findAll({
        include: [
            { 
                association: 'i18n',
                where: {
                    languageId,
                    title: {
                        [models.Sequelize.Op.in]: cleanedInputTags
                    }
                }
             }
        ]
    }, { transaction });

    let newTags = [];
    if (existingTags.length === 0) newTags = cleanedInputTags;
    else newTags = cleanedInputTags.filter(item => !existingTags.find(el => el.i18n[0].title === item));

    let newArticleArticleTags = [];

    if (newTags.length) {
        const createdTags = await models.articleTag.bulkCreate(newTags.map(_ => { }), { transaction });

        // Create tag texts - need tag_id from tags
        const mappedTagTexts = newTags.map((title, i) => {
            return {
                tagId: createdTags[i].id,
                languageId,
                title
            };
        });

        await models.articleTagText.bulkCreate(mappedTagTexts, { transaction });

        // Link new tags with article
        newArticleArticleTags = articleArticleTag = await models.articleArticleTag.bulkCreate(createdTags.map(newTag => ({
            id: uuid(),
            tagId: newTag.id,
            articleId
        })), { transaction });
    }

    let existingArticleArticleTag = [];
    if (existingTags.length) {
        existingArticleArticleTag = await models.articleArticleTag.findAll({
            attributes: ['id', 'tagId'],
            where: {
                tagId: {
                    [models.Sequelize.Op.in]: existingTags.map(tag => tag.id)
                },
                articleId
            }
        }, { transaction });

        if (existingArticleArticleTag.length !== existingTags.length) {
            const missingArticleArticleTags = existingTags.filter(item => !existingArticleArticleTag.find(el => el.tagId === item.id));
            if (missingArticleArticleTags.length) {
                const newMissingArticleArticleTags = await models.articleArticleTag.bulkCreate(missingArticleArticleTags.map(newTag => ({
                    id: uuid(),
                    tagId: newTag.id,
                    articleId
                })), { transaction });

                existingArticleArticleTag = existingArticleArticleTag.concat(newMissingArticleArticleTags);
            }
        }
    }

    // Remove article tags
    const articleArticleTagsToRemove = articleArticleTags.filter(aat => cleanedInputTags.findIndex(title => title === aat.tag.i18n[0].title) === -1);
    if (articleArticleTagsToRemove.length) {
        // Remove the associated users first
        articleArticleTagsToRemove.forEach(aat => {
            if (aat.users.length) {
                aat.removeUsers(aat.users, { transaction })
            }
        });

        // Remove the article article tags
        await models.articleArticleTag.destroy({
            where: {
                id: {
                    [models.Sequelize.Op.in]: articleArticleTagsToRemove.map(k => k.id)
                }
            }
        }, { transaction });
    }
    
    const mergedArticleArticleTags = newArticleArticleTags.concat(existingArticleArticleTag);
    
    if (isSet !== undefined) {
        if (isSet) {
            if (mergedArticleArticleTags.length) {
                await foundUser.addArticleTags(mergedArticleArticleTags, { transaction });
            }
        } else {
            if (existingArticleArticleTag.length) {
                await foundUser.removeArticleTags(existingArticleArticleTag, { transaction });
            }
        }
    }
}

const handleArticleTags = async(language, { titles, articleId, isSet }, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.article.handleArticleTags, {
        language,
        titles,
        articleId,
        isSet
    });
    
    const languageId = await getLanguageIdByCode(models, language);

    let result = false;
    await models.sequelize.transaction(async t => {
        await storeArticleTags(titles, articleId, languageId, isSet, user, models, t);
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

const newsFeedArticles = async (language, { user, models }) => {
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
    
        const followingArticles = await models.article.findAll(merge(
            {
                where: {
                    [models.Sequelize.Op.or]: [
                        { ownerId: { [models.Sequelize.Op.eq]: user.id } },
                        { '$author.followers.id$': { [models.Sequelize.Op.eq]: user.id } }
                    ]
                },
                ...includeForFind(languageId)
            },
            {
                include: [
                    {
                        association: 'author',
                        include: [
                            { 
                                association: 'followers',
                                attributes: ['id']
                            },
                            { association: 'profile' }
                        ],
                        required: false
                    }
                ],
                order: [ [ 'createdAt', 'desc' ] ]
            }
        )).then(mapArticles);
    
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

const feedArticles = async (language, userId, companyId, teamId, { models }) => {
    yupValidation(schema.article.feed, { language, userId, companyId, teamId });

    const languageId = await getLanguageIdByCode(models, language);

    if (userId) {
        return models.article.findAll({
            where: { 
                ownerId: userId,
                postAs: 'profile'
            },
            ...includeForFind(languageId),
            order: [ [ 'createdAt', 'desc' ] ]
        }).then(mapArticles);
    }

    if (companyId) {
        return models.article.findAll({
            where: {
                postAs: 'company',
                postingCompanyId: companyId
            },
            ...includeForFind(languageId),
            order: [ [ 'createdAt', 'desc' ] ]
        }).then(mapArticles);
    }

    if (teamId) {
        return models.article.findAll({
            where: {
                    postAs: 'team',
                    postingTeamId: teamId
            },
            ...includeForFind(languageId),
            order: [ [ 'createdAt', 'desc' ] ]
        }).then(mapArticles);
    }

    return [];
}

const mapArticles = articles => articles.map(mapArticle);

const mapArticle = article => ({
    ...article.get(),
    author: {
        ...article.author.get(),
        ...article.author.profile.get()
    },
    tags: article.tags.map(tag => ({
        ...tag.tag.get(),
        id: tag.tag.i18n[0].title,
        users: tag.users
    }))
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
            { association: 'featuredImage' },
            { 
                association: 'tags',
                include: [
                    {
                        association: 'tag',
                        include: [
                            { association: 'i18n', where: { languageId } }
                        ]
                    },
                    { association: 'users', required: false }
                ]
            },
            { association: 'postingCompany' },
            { association: 'postingTeam' }
        ]
    };
}

module.exports = {
    Query: {
        articles: (_, { language }, context) => all(language, context),
        article: (_, { id, language }, context) => article(id, language, context),
        newsFeedArticles: (_, { language }, context) => newsFeedArticles(language, context),
        feedArticles: (_, { language, userId, companyId, teamId, }, context) => feedArticles(language, userId, companyId, teamId, context),
    },
    Mutation: {
        handleArticle: (_, { language, article, options }, context) => handleArticle(language, article, options, context),
        handleArticleTags: (_, { language, details }, context) => handleArticleTags(language, details, context),
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