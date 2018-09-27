const schema = require('../validation');
const { yupValidation } = require('./common');

const industries = async (language, { models }) => {
    yupValidation(schema.industry.all, { language });

    //const languageId = await getLanguageIdByCode(models, language);
    return models.industry.findAll({
        // include: [
        //     { association: 'i18n', where: { languageId } }
        // ]
    })
}

module.exports = {
    Query: {
        industries: (_, { language }, context) => industries(language, context)
    }
}