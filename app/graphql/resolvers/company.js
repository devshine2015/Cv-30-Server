const uuid = require('uuidv4');
const schema = require('../validation');
const { validateUser } = require('./user');

const handleCompany = async(language, details, { user, models }) => {
    validateUser(user);

    try {
        schema.company.input.validateSync({
            language,
            details
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

const handleTeam = async (teamDetails, { user, models }) => {
    validateUser(user);
    console.log(teamDetails);
    try {
        schema.team.input.validateSync({
            teamDetails
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

    teamDetails.id = teamDetails.id || uuid();
    teamDetails.coverBackground = teamDetails.profileBackgroundColor;
    await models.team.upsert(teamDetails);

    return { status: true };
}

const handleQA = async (qa, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    return response;
}

module.exports = {
    handleCompany,
    handleQA,
    handleTeam,
    all
}