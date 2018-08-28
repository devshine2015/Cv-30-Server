const schema = require('../validation');
const { yupValidation, getLanguageIdByCode, checkUserAuth, throwForbiddenError } = require('./common');

const handleLandingPage = async (language, details, { user, models }) => {
    checkUserAuth(user);
    const foundUser = await models.user.findOne({
        where: { id: user.id, god: true },
        attributes: ["id"]
    });
    
    if (!foundUser) throwForbiddenError();

    yupValidation(schema.landingPage.input, {
        language,
        details
    });

    let result = false;
    await models.sequelize.transaction(async t => {
        details.id = 1;
        await models.landingPage.upsert(details, { transaction: t });
        details.landingPageId = details.id;
        details.languageId = await getLanguageIdByCode(models, language);
        await models.landingPageText.upsert(details, { transaction: t });
        result = true;
    });

    return { status: result };
}

const landingPage = async (language, { models }) => {
    yupValidation(schema.landingPage.one, { language });

    const landingPage = await models.landingPage.findOne({
        where: { id: 1 },
        ...includeForFind(await getLanguageIdByCode(models, language))
    });

    const articles = await models.article.findAll({
        where: {
            postAs: 'landingPage'
        },
        include: [
            { association: 'i18n' },
            { association: 'images' },
            { association: 'videos' },
            { association: 'featuredImage' }
        ]
    });
    return {
        ...landingPage,
        articles
    };
}

const includeForFind = (languageId) => {
    return {
        include: [
            { association: 'i18n', where: { languageId } }
        ]
    };
}

module.exports = {
    Query: {
        landingPage: (_, { language }, context) => landingPage(language, context),
    },
    Mutation: {
        handleLandingPage: (_, { language, details }, context) => handleLandingPage(language, details, context),
    }
};