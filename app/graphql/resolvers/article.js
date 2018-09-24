const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, getLanguageIdByCode, validateCompany, validateTeam, validateArticle, throwForbiddenError } = require('./common');

const appreciate = async (tagId, articleId, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.article.appreciate, {
        tagId,
        articleId
    });
    const article = await models.article.findOne({
        attributes: ['id', 'ownerId'],
        where: {
            id: articleId
        },
        include: [
            { association: 'activeTags', where: { tagId } }
        ]
    });
    if (!article) return { status: false };
    if (article.ownerId == user.id) return { status: false };
    try {
        let voters = article.activeTags && article.activeTags.length == 1 && article.activeTags[0].voters || '';
        if (voters) voters = JSON.parse(voters);
        else voters = [];
        if (voters.indexOf(user.id) == -1) {
            voters.push(user.id);
            article.activeTags[0].voters = JSON.stringify(voters);
            article.activeTags[0].votes++;
            await article.activeTags[0].save();
            return { status: true };
        }
        return { status: false };
    } catch(error) { return { status: false }; }
}

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

        if (article.postAs === 'landingPage' && (!user.god || options)) throwForbiddenError();
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
            if (article.title) {
                let newSlug = slugify(article.title);
                let newSlugBad = true;
                while (newSlugBad) {
                    const existingArticleSlug = await models.article.findOne({ attributes: ["slug"], where: { slug: newSlug } }, { transaction: t });
                    if (!existingArticleSlug || existingArticleSlug.articleId === article.id) {
                        newSlugBad = false;
                    } else {
                        newSlug = slugify(`${article.title} ${new Date().getTime()}`);
                    }
                }
                article.slug = newSlug;
            }
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
                    title: item.title,
                    description: item.description,
                    path: item.path
                })), {
                        updateOnDuplicate: ["isFeatured", "path"],
                        transaction: t
                    });
                /*await models.imageText.bulkCreate(article.images.map(item => ({
                    imageId: item.id,
                    title: item.title,
                    description: item.description,
                    languageId
                })), {
                    updateOnDuplicate: ["title", "description"],
                    transaction: t
                });*/
            }

            if (article.videos && article.videos.length > 0) {
                await models.video.bulkCreate(article.videos.map(item => ({
                    id: item.id,
                    userId: user.id,
                    isFeatured: item.isFeatured,
                    sourceId: article.id,
                    sourceType: item.sourceType,
                    title: item.title,
                    description: item.description,
                    path: item.path
                })), {
                    updateOnDuplicate: ["isFeatured", "path"],
                    transaction: t
                });
                // await models.videoText.bulkCreate(article.videos.map(item => ({
                //     videoId: item.id,
                //     title: item.title,
                //     description: item.description,
                //     languageId
                // })), {
                //         updateOnDuplicate: ["title", "description"],
                //         transaction: t
                //     });
            }
            /*if (!!article.title || !!article.description) {
                if (article.title) {
                    let newSlug = slugify(article.title);
                    let newSlugBad = true;
                    while (newSlugBad) {
                        const existingArticleText = await models.articleText.findOne({ attributes: ["articleId", "slug"], where: { slug: newSlug } }, { transaction: t });
                        if (!existingArticleText || existingArticleText.articleId === article.articleId) {
                            newSlugBad = false;
                        } else {
                            newSlug = slugify(`${article.title} ${new Date().getTime()}`);
                        }
                    }
                    article.slug = newSlug;
                }
                await models.articleText.upsert(article, { transaction: t });
            }*/
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
    })
    .then(async () => {
        if (article.tags) {
            await storeArticleTags(article.tags, article.id, languageId, user, models, null);
        }
    });

    return { status: result };
}

const removeArticle = async (id, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.article.removeArticle, {
        id
    });

    const articleOk = await validateArticle(id, user, models);
    if (articleOk !== true) return articleOk;

    if (await models.article.destroy({ where: { id } })) {
        return { status: true };
    }

    return { status: false };
}

const storeArticleTags = async (tags, articleId, languageId, user, models, t) => {
    await models.sequelize.transaction(async transaction => {
        const article = await models.article.findOne({ where: { id: articleId } }, { transaction });
        console.log(article);
        let dbArticleTags = await models.articleTag.findAll({
            where: {
                title: {
                    [models.Sequelize.Op.in]: tags
                }
            },
            transaction
        });
        const newTags = tags.filter(tag => !dbArticleTags.filter(dbTag => dbTag.title == tag).length);
        if (newTags.length) {
            await models.articleTag.bulkCreate(newTags.map(title => ({ title })), { transaction });
            const newDbTags = await models.articleTag.findAll({
                where: {
                    title: {
                        [models.Sequelize.Op.in]: newTags
                    }
                },
                transaction
            });
            dbArticleTags = dbArticleTags.concat(newDbTags);
        }
        await article.setTags(dbArticleTags, { transaction });
    });
    // return;
    // const cleanedInputTags = titles.map(title => title.trim().toLowerCase());

    // Get data before changes
    // const foundUser = await models.user.findOne({
    //     attributes: ['id'],
    //     where: {
    //         id: user.id
    //     }
    // }, { transaction });

    // const articleArticleTags = await models.articleArticleTag.findAll({
    //     attributes: ['id', 'tagId'],
    //     where: {
    //         articleId
    //     },
    //     include: [
    //         { association: 'users', attributes: ['id'] },
    //         {
    //             association: 'tag',
    //             attributes: ['id', 'title'],
    //             // include: [
    //             //     { association: 'i18n', attributes: ['title'], where: { languageId } }
    //             // ]
    //         }
    //     ]
    // }, { transaction });

    // Start the changes. Find what's new, first.
    // const existingTags = await models.articleTag.findAll({
        /*include: [
            {
                association: 'i18n',
                where: {
                    languageId,
                    title: {
                        [models.Sequelize.Op.in]: cleanedInputTags
                    }
                }
            }
        ]*/
    // }, { transaction });

    // let newTags = [];
    // if (existingTags.length === 0) newTags = cleanedInputTags;
    // else newTags = cleanedInputTags.filter(item => !existingTags.find(el => el.i18n[0].title === item));

    // let newArticleArticleTags = [];

    // if (newTags.length) {
    //     const createdTags = await models.articleTag.bulkCreate(newTags.map(title => ({
    //         title
    //     })), { transaction });

        // Create tag texts - need tag_id from tags
        // const mappedTagTexts = newTags.map((title, i) => {
        //     return {
        //         tagId: createdTags[i].id,
        //         languageId,
        //         title
        //     };
        // });

        // await models.articleTagText.bulkCreate(mappedTagTexts, { transaction });

        // Link new tags with article
    //     newArticleArticleTags = articleArticleTag = await models.articleArticleTag.bulkCreate(createdTags.map(newTag => ({
    //         id: uuid(),
    //         tagId: newTag.id,
    //         articleId
    //     })), { transaction });
    // }

    // let existingArticleArticleTag = [];
    // if (existingTags.length) {
    //     existingArticleArticleTag = await models.articleArticleTag.findAll({
    //         attributes: ['id', 'tagId'],
    //         where: {
    //             tagId: {
    //                 [models.Sequelize.Op.in]: existingTags.map(tag => tag.id)
    //             },
    //             articleId
    //         }
    //     }, { transaction });

    //     if (existingArticleArticleTag.length !== existingTags.length) {
    //         const missingArticleArticleTags = existingTags.filter(item => !existingArticleArticleTag.find(el => el.tagId === item.id));
    //         if (missingArticleArticleTags.length) {
    //             const newMissingArticleArticleTags = await models.articleArticleTag.bulkCreate(missingArticleArticleTags.map(newTag => ({
    //                 id: uuid(),
    //                 tagId: newTag.id,
    //                 articleId
    //             })), { transaction });

    //             existingArticleArticleTag = existingArticleArticleTag.concat(newMissingArticleArticleTags);
    //         }
    //     }
    // }

    // // Remove article tags
    // const articleArticleTagsToRemove = articleArticleTags.filter(aat => cleanedInputTags.findIndex(title => title === aat.tag.i18n[0].title) === -1);
    // if (articleArticleTagsToRemove.length) {
    //     // Remove the associated users first
    //     articleArticleTagsToRemove.forEach(aat => {
    //         if (aat.users.length) {
    //             aat.removeUsers(aat.users, { transaction })
    //         }
    //     });

    //     // Remove the article article tags
    //     await models.articleArticleTag.destroy({
    //         where: {
    //             id: {
    //                 [models.Sequelize.Op.in]: articleArticleTagsToRemove.map(k => k.id)
    //             }
    //         }
    //     }, { transaction });
    // }

    // const mergedArticleArticleTags = newArticleArticleTags.concat(existingArticleArticleTag);

    // if (isSet !== undefined) {
    //     if (isSet) {
    //         if (mergedArticleArticleTags.length) {
    //             await foundUser.addArticleTags(mergedArticleArticleTags, { transaction });
    //         }
    //     } else {
    //         if (existingArticleArticleTag.length) {
    //             await foundUser.removeArticleTags(existingArticleArticleTag, { transaction });
    //         }
    //     }
    // }
}

const handleArticleTags = async (language, { titles, articleId}, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.article.handleArticleTags, {
        language,
        titles,
        articleId
    });

    const languageId = await getLanguageIdByCode(models, language);

    let result = false;
    await models.sequelize.transaction(async t => {
        await storeArticleTags(titles, articleId, languageId, user, models, t);
        result = true;
    });

    return { status: result };
}

const article = async (id, language, { user, models }) => {
    yupValidation(schema.article.one, { id, language });

    return models.article.findOne({
        where: { id },
        ...includeForFind(await getLanguageIdByCode(models, language))
    }).then(article => mapArticle(article, user));
}

const all = async (language, { models, user }) => {
    yupValidation(schema.article.all, { language });
    return models.article.findAll({
        where: {
            ownerId: user.id
        },
        ...includeForFind(await getLanguageIdByCode(models, language))
    }).then(articles => mapArticles(articles, user));
}

const newsFeedArticles = async (language, peopleOrCompany, tags, first, after, { user, models }) => {
    yupValidation(schema.article.newsFeedArticles, {
        language,
        peopleOrCompany,
        tags,
        first,
        after
    });

    const languageId = await getLanguageIdByCode(models, language);
    const filteredTags = tags ? tags.map(tag => tag.trim().toLowerCase()) : [];

    let where, include;
    if (user && (!peopleOrCompany && !(tags && tags.length))) {
        // Following articles
        where = {
            [models.Sequelize.Op.and]: [{
                [models.Sequelize.Op.or]: [
                    { postAs: { [models.Sequelize.Op.in]: ['company', 'team'] } },
                    {
                        [models.Sequelize.Op.and]: [
                            { postAs: 'profile' },
                            {
                                [models.Sequelize.Op.or]: [
                                    { ownerId: { [models.Sequelize.Op.eq]: user.id } },
                                    { '$author.followers.id$': { [models.Sequelize.Op.eq]: user.id } }
                                ]
                            }
                        ]
                    }
                ]
            }]
        };

        include = [
            {
                association: 'author',
                attributes: ['id'],
                include: [
                    {
                        association: 'followers',
                        attributes: ['id']
                    }
                ],
                required: false
            }
        ];
    } else {
        where = { postAs: { [models.Sequelize.Op.ne]: 'landingPage' } };
        include = [];
        if (peopleOrCompany) addPeopleOrCompanyToQueryParams(where, include, peopleOrCompany, models);
        if (tags && tags.length) addTagsToQueryParams(where, include, filteredTags, languageId, models);
    }

    if (after) {
        after = Buffer.from(after, 'base64').toString('ascii').slice(0, 19).replace('T', ' ');;
        where.createdAt = {
            [models.Sequelize.Op.lt]: after
        }
    }

    const followingArticlesIds = await models.article.findAll({
        where,
        attributes: ['id', 'createdAt'],
        include,
        order: [['createdAt', 'desc']],
        limit: first + 1
    });

    let hasNextPage = false;
    if (followingArticlesIds.length === first + 1) {
        hasNextPage = true;
    }

    return getArticlesByIds(hasNextPage ? followingArticlesIds.slice(0, followingArticlesIds.length -1) : followingArticlesIds, languageId, models, user)
        .then(articles => ({
            edges: articles.map(article => ({
                node: article,
                cursor: Buffer.from(article.createdAt.toISOString()).toString('base64')
            })),
            pageInfo: {
                hasNextPage
            }
        }));
}

const addPeopleOrCompanyToQueryParams = (where, include, peopleOrCompany, models) => {
    where[models.Sequelize.Op.or] = [
        { '$author.first_name$': { [models.Sequelize.Op.like]: `%${peopleOrCompany}%` } },
        { '$author.last_name$': { [models.Sequelize.Op.like]: `%${peopleOrCompany}%` } },
        { '$postingCompany.name$': { [models.Sequelize.Op.like]: `%${peopleOrCompany}%` } }
    ];
    const authorAss = include.find(ass => ass.association === 'author');
    if (authorAss) {
        authorAss.attributes = [...authorAss.attributes, 'lastName', 'firstName'];
    } else {
        include.push({
            association: 'author',
            attributes: ['id', 'lastName', 'firstName'],
            required: false
        });
    }

    include.push({
        association: 'postingCompany',
        attributes: ['id', 'name'],
        required: false
    });
}

const addTagsToQueryParams = (where, include, filteredTags, languageId, models) => {
    where['$tags.tag.i18n.title$'] = { [models.Sequelize.Op.in]: filteredTags };
    include.push({
        association: 'tags',
        attributes: ['id'],
        include: [
            {
                association: 'tag',
                attributes: ['id', 'title'],
                // include: [
                //     { association: 'i18n', where: { languageId }, attributes: ['title'] }
                // ]
            },
        ]
    });
}

const getArticlesByIds = async (articleIds, languageId, models, user) => {
    let articles = [];
    let where = {};
    if (articleIds.length) {
        where = {
            id: { [models.Sequelize.Op.in]: articleIds.map(article => article.id) }
        };
        articles = await models.article.findAll({
            where,
            ...includeForFind(languageId),
            order: [['createdAt', 'desc']]
        }).then(articles => mapArticles(articles, user));
    }

    return articles;
}

const feedArticles = async (language, userId, companyId, teamId, { user, models }) => {
    yupValidation(schema.article.feed, { language, userId, companyId, teamId });

    const languageId = await getLanguageIdByCode(models, language);

    if (userId) {
        return models.article.findAll({
            where: {
                ownerId: userId,
                postAs: 'profile'
            },
            ...includeForFind(languageId),
            order: [['createdAt', 'desc']]
        }).then(articles => mapArticles(articles, user));
    }

    if (companyId) {
        return models.article.findAll({
            where: {
                postAs: 'company',
                postingCompanyId: companyId
            },
            ...includeForFind(languageId),
            order: [['createdAt', 'desc']]
        }).then(articles => mapArticles(articles, user));
    }

    if (teamId) {
        return models.article.findAll({
            where: {
                postAs: 'team',
                postingTeamId: teamId
            },
            ...includeForFind(languageId),
            order: [['createdAt', 'desc']]
        }).then(articles => mapArticles(articles, user));
    }

    return [];
}

const mapArticles = (articles, user) => articles.map(article => mapArticle(article, user));

const mapArticle = (article, user) => {
    let canVote = {};
    article.activeTags && article.activeTags.length && article.activeTags.map(tag => {
        var voters = tag.voters && JSON.parse(tag.voters) || [];
        if (user && voters.indexOf(user.id) == -1) canVote[tag.tagId] = true;
        else canVote[tag.tagId] = false;
    });
    return {
        ...article.get(),
        author: {
            ...article.author.get(),
            ...article.author.profile.get()
        },
        tags: article.activeTags.map(({ tag: { id, title }, votes }) => ({
            id,
            title,
            votes,
            canVote: user && article.ownerId != user.id && canVote[id]
        }))
    };
};

const includeForFind = (languageId) => {
    return {
        include: [
            {
                association: 'author',
                include: [
                    { association: 'profile' }
                ]
            },
            // { association: 'i18n', where: { languageId } },
            { association: 'images' },
            { association: 'videos' },
            { association: 'featuredImage' },
            {
                association: 'activeTags',
                include: [
                    {
                        association: 'tag',
                        // include: [
                        //     { association: 'i18n', where: { languageId } }
                        // ]
                    }
                    // { association: 'users', required: false }
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
        newsFeedArticles: (_, { language, peopleOrCompany, tags, first, after }, context) => newsFeedArticles(language, peopleOrCompany, tags, first, after, context),
        feedArticles: (_, { language, userId, companyId, teamId, }, context) => feedArticles(language, userId, companyId, teamId, context),
    },
    Mutation: {
        appreciate: (_, { tagId, articleId }, context) => appreciate(tagId, articleId, context),
        handleArticle: (_, { language, article, options }, context) => handleArticle(language, article, options, context),
        handleArticleTags: (_, { language, details }, context) => handleArticleTags(language, details, context),
        removeArticle: (_, { id }, context) => removeArticle(id, context)
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