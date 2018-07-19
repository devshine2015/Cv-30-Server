const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, throwForbiddenError, getLanguageIdByCode } = require('./common');

const handleJob = async (language, jobDetails, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.job.input, {
        language,
        jobDetails
    });

    const company = await models.company.findOne({ where: { id: jobDetails.companyId } });
    if (!company)
        return { status: false, error: 'Company not found' };

    if (company.user_id != user.id)
        throwForbiddenError();

    await models.sequelize.transaction(async t => {
        jobDetails.id = jobDetails.id || uuid();
        await models.job.upsert(jobDetails, { transaction: t });
        jobDetails.jobId = jobDetails.id;
        jobDetails.languageId = await getLanguageIdByCode(models, language);
        await models.jobText.upsert(jobDetails, { transaction: t });
    });

    return { status: true };
}

const job = async (id, language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.job.one, { id, language });

    return models.job.findOne({
        where: { id },
        ...includeForFind(await getLanguageIdByCode(models, language))
    });
}

const all = async (language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.job.all, { language });

    return models.job.findAll({
        ...includeForFind(await getLanguageIdByCode(models, language))
    });
}

const includeForFind = (languageId) => {
    return {
        include: [
            { association: 'i18n', where: { languageId } },
            { association: 'team' },
            {
                association: 'company',
                include: [
                    {
                        association: 'i18n', where: { languageId }
                    }, {
                        association: 'officeArticles',
                        include: [
                            { association: 'featuredImage', include: [{ association: 'i18n', where: { languageId } }] },
                            { association: 'i18n', where: { languageId } },
                            { association: 'images', include: [{ association: 'i18n', where: { languageId } }] },
                            { association: 'videos', include: [{ association: 'i18n', where: { languageId } }] }
                        ]
                    }, {
                        association: 'faqs',
                        include: [
                            { association: 'i18n', where: { languageId } }
                        ]
                    }
                ]
            }
        ]
    }
}

module.exports = {
    handleJob,
    job,
    all
}