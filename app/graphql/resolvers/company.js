const uuid = require('uuidv4');
const schema = require('../validation');
const { validateUser, yupValidation } = require('./user');

const handleCompany = async(language, details, { user, models }) => {
    validateUser(user);
    yupValidation(schema.company.input, { language, details });
    
    language = await models.language.findOne({
        where: {
            code: language
        }
    });

    await models.sequelize.transaction(async t => {
        details.id = details.id || uuid();
        await models.company.upsert(details, {transaction: t});
        details.companyId = details.id;
        details.languageId = language.id;
        await models.companyText.upsert(details, {transaction: t});
    });

    return { status: true };
}

const all = async (language, { models }) => {
    language = await models.language.findOne({
        where: {
            code: language
        }
    });

    return models.company.findAll({
        include: [
            {
                association: 'i18n',
                where: { languageId: language.id }
            }, {
                association: 'featuredArticles',
                include: [
                    { association: 'featuredImage', include: [{ association: 'i18n' }] },
                    { association: 'images', include: [{ association: 'i18n' }] },
                    { association: 'i18n', where: { languageId: language.id } }
                ]
            }, {
                association: 'officeArticles',
                include: [
                    { association: 'featuredImage', include: [{ association: 'i18n' }] },
                    { association: 'i18n', where: { languageId: language.id } },
		            { association: 'images', include: [{ association: 'i18n' }] }
                ]
            }, {
                association: 'storiesArticles',
                include: [
                    { association: 'featuredImage', include: [{ association: 'i18n' }] },
                    { association: 'i18n', where: { languageId: language.id } },
		            { association: 'images', include: [{ association: 'i18n' }] }
                ]
            }, {
                association: 'faqs',
                include: [
                    { association: 'i18n', where: { languageId: language.id } }
                ]
            }
        ]
    })
};

const handleFAQ = async (language, details, { user, models }) => {
    validateUser(user);
    yupValidation(schema.company.faqInput, { language, details });

    language = await models.language.findOne({
        where: {
            code: language
        }
    });

    await models.sequelize.transaction(async t => {
        details.id = details.id || uuid();
        await models.faq.upsert(details, { transaction: t });
        details.faqId = details.id;
        details.languageId = language.id;
        await models.faqText.upsert(details, { transaction: t });
    });

    return { status: true };
}

module.exports = {
    handleCompany,
    handleFAQ,
    all
}