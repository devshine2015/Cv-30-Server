const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, throwForbiddenError } = require('./common');

const handleArticle = async (language, article, options, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.article.input, {
        language,
        article,
        options
    });

    if (article && article.id) {
        const foundArticle = await models.article.findOne({ where: { id: article.id } });
        if (foundArticle && foundArticle.userId != user.id) throwForbiddenError();
    }

    if (options) {
        if (options.articleId) {
            const foundArticle = await models.article.findOne({ attributes: ["id", "userId"], where: { id: options.articleId } });
            if (foundArticle && foundArticle.userId != user.id) throwForbiddenError();
        }

        if (options.companyId) {
            const foundCompany = await models.company.findOne({ attributes: ["id", "userId"], where: { id: options.companyId } });
            if (!foundCompany) return { status: false, error: 'Company not found' }
            if (foundCompany.userId != user.id) throwForbiddenError();
        }

        if (options.teamId) {
            const foundTeam = await models.team.findOne({
                attributes: ["id"], 
                where: { id: options.teamId },
                include: [
                    { association: 'company', attributes: ["id", "userId"] }
                ]
            });
            if (!foundTeam) return { status: false, error: 'Team not found' }
            if (foundTeam.company.userId != user.id) throwForbiddenError();
        }
    }

    language = await models.language.findOne({
        where: {
            code: language
        }
    });

    await models.sequelize.transaction(async t => {
        if (article) {
            article.id = article.id || uuid();
            article.userId = user.id;
            await models.article.upsert(article, { transaction: t });
            article.articleId = article.id;
            article.languageId = language.id;
            if (article.title) article.slug = slugify(article.title);
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
                console.log(article.videos);
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
                await models.articleText.upsert(article, { transaction: t });
            }
        }
        if (options && options.articleId && options.companyId) {
            article = await models.article.findOne({ attributes: ["id"], where: { id: options.articleId }, transaction: t });
            const company = await models.company.findOne({ attributes: ["id"], where: { id: options.companyId } });
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
            const team = await models.team.findOne({ attributes: ["id"], where: { id: options.teamId } });
            if (options.isAtOffice) {
                await team.addOfficeArticle(article, { transaction: t });
            } else {
                await team.removeOfficeArticle(article, { transaction: t });
            }
        }
    });

    return { status: true };
}

const article = async (id, language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.article.one, { id, language });
    language = await models.language.findOne({
        where: {
            code: language
        }
    });
    return models.article.findOne({
        where: { id },
        ...includeForFind(language.id)
    });
}

const all = async (language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.article.all, { language });
    language = await models.language.findOne({
        where: {
            code: language
        }
    });
    return models.article.findAll({
        where: {},
        ...includeForFind(language.id)
    });
}

const includeForFind = (languageId) => {
    return {
        include: [
            { association: 'author' },
            { association: 'i18n', where: { languageId } },
            { association: 'images' },
            { association: 'videos' },
            { association: 'featuredImage' }
        ]
    };
}

module.exports = {
    handleArticle,
    article,
    all
}

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