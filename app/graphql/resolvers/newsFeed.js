const schema = require('../validation');
const { yupValidation, getLanguageIdByCode, checkUserAuth, throwForbiddenError } = require('./common');

const handleAd = async (language, details, { user, models }) => {
    checkUserAuth(user);
    const foundUser = await models.user.findOne({
        where: { id: user.id, god: true },
        attributes: ["id"]
    });
    
    if (!foundUser) throwForbiddenError();

    yupValidation(schema.newsFeed.handleAd, {
        language,
        details
    });

    const languageId = await getLanguageIdByCode(models, language);

    let result = false;
    await models.sequelize.transaction(async transaction => {
        await models.ad.upsert(details, { transaction });
        details.landingPageId = details.id;
        await models.image.upsert( {
            ...details.image,
            userId: user.id,
            title: details.image.title,
            description: details.image.description,
            sourceId: details.id
        }, { transaction });

        /*await models.imageText.upsert({
            imageId: details.image.id,
            title: details.image.title,
            description: details.image.description,
            languageId
        }, { transaction });*/

        result = true;
    });

    return { status: result };
}

const ads = async (language, { models }) => {
    yupValidation(schema.newsFeed.ads, { language });

    return models.ad.findAll({
        ...includeForFind(await getLanguageIdByCode(models, language))
    });
}

const includeForFind = (languageId) => {
    return {
        include: [
            {
                association: 'image',
                // include: [
                //     { association: 'i18n', where: { languageId } }
                // ]
            }
        ]
    };
}

module.exports = {
    Query: {
        ads: (_, { language }, context) => ads(language, context),
    },
    Mutation: {
        handleAd: (_, { language, details }, context) => handleAd(language, details, context),
    }
};