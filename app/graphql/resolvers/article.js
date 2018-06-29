const uuid = require('uuidv4');
const schema = require('../validation');
// const slug = require('limax');

const handleArticle = async (language, article, options, { user, models }) => {
    validateUser(user);

    try {
        schema.article.input.validateSync({
            language,
            article,
            options
        }, { abortEarly: false });
    } catch (error) {
        console.log(error);
        throw new Error(
            JSON.stringify(
                error.inner.map(err => ({
                    path: err.path,
                    type: err.type,
                    message: err.message
                }))
            )
        );
    }

    let response = {
        status: false,
        error: ''
    };

    // Get language
    language = await models.language.findOne({
        where: {
            code: language
        }
    });
    await models.sequelize.transaction(async t => {
        if (article) {
            article.id = article.id || uuid();
            article.userId = user.id;   
            await models.article.upsert(article);
            article.articleId = article.id;
            article.languageId = language.id;
            article.slug = slugify(article.title);
            await models.articleText.upsert(article);
        }
        if (options && options.articleId && options.companyId) {
            article = await models.article.findOne({ where: { id: options.articleId } });
            company = await models.company.findOne({ where: { id: options.companyId } });
            if (options.isFeatured) company.addFeaturedArticle(article);
            if (options.isAtOffice) company.addOfficeArticle(article);
            if (options.isMoreStories) company.addStoriesArticle(article);
        }
    });

    return { status: true };
}

module.exports = {
    handleArticle
}

const validateUser = (user) => {
    const errors = [];

    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    if (errors.length) {
        console.log(errors);
        throw new Error(errors);
    }
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