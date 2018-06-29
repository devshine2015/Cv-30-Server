const uuid = require('uuidv4');
const schema = require('../validation');

const handleArticle = async ({ id, img, title, text, language }, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    // Get language
    const languageModel = await models.language.findOne({
        where: {
            code: language
        }
    });

    if (languageModel) {
        await models.sequelize.transaction(async t => {
            const articleId = id ? id : uuid();
            await models.article.upsert({
                id: articleId,
                is_featured: true
            });
            await models.articleText.upsert({
                articleId: articleId,
                languageId: languageModel.dataValues.id,
                title,
                description: text
            });
        });
        response.status = true;
    } else {
        response.error = 'Language not found!';
    }

    return response;
}

const handleTeam = async (team, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    return response;
}

const handleQA = async (qa, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    return response;
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

module.exports = {
    handleArticle,
    handleQA,
    handleTeam
}