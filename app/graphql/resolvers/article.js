const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation } = require('./common');

const handleArticle = async (language, article, options, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.article.input, {
        language,
        article,
        options
    });

    language = await models.language.findOne({
        where: {
            code: language
        }
    });
    await models.sequelize.transaction(async t => {
        if (article) {
            article.id = article.id || uuid();
            article.userId = user.id;   
            await models.article.upsert(article, {transaction: t});
            article.articleId = article.id;
            article.languageId = language.id;
            article.slug = slugify(article.title);
            if (article.images) {
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
            if (article.images) {
                await models.image.bulkCreate(article.images.map(item => ({
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
            if (article.videos) {
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
            await models.articleText.upsert(article, { transaction: t });
        }
        if (options && options.articleId && options.companyId) {
            article = await models.article.findOne({ where: { id: options.articleId } });
            company = await models.company.findOne({ where: { id: options.companyId } });
            if (options.isFeatured) company.addFeaturedArticle(article, {transaction: t});
            if (options.isAtOffice) company.addOfficeArticle(article, {transaction: t});
            if (options.isMoreStories) company.addStoriesArticle(article, {transaction: t});
        }
        if (options && options.articleId && options.teamId && options.isAtOffice) {
            models.teamOfficeArticles.upsert({
                team_id: options.teamId,
                article_id: options.articleId
            }, { transaction: t})
        }
    });

    return { status: true };
}

const all = async (language, { models }) => {
    language = await models.language.findOne({
        where: {
            code: language
        }
    });
    return models.article.findAll({
        where: {},
        include: [
            { association: 'author' },
            { association: 'i18n' },
            { association: 'images' },
            { association: 'featuredImage' }
        ]
    });
}

module.exports = {
    handleArticle,
    all
}

function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
         str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

    return str;
};