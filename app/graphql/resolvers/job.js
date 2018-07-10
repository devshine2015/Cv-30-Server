const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, throwForbiddenError } = require('./common');

const handleJob = async (language, jobDetails, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.job.input, {
        language,
        jobDetails
    });

    language = await models.language.findOne({
        where: {
            code: language
        }
    });

    const company = await models.company.findOne({ where: { id: jobDetails.companyId } });
    if (!company)
        return { status: false, error: 'Company not found' };
    
    if (company.userId != user.id)
        throwForbiddenError();

    if (jobDetails.id && !await models.job.findOne({ where: { id: jobDetails.id } }))
        return { status: false, error: 'Job not found' }

    await models.sequelize.transaction(async t => {
        jobDetails.id = jobDetails.id || uuid();
        await models.job.upsert(jobDetails, { transaction: t });
        jobDetails.jobId = jobDetails.id;
        jobDetails.languageId = language.id;
        await models.jobText.upsert(jobDetails, { transaction: t });
    });

    return { status: true };
}

const job = async (id, language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.job.one, { id, language });

    language = await models.language.findOne({
        where: {
            code: language
        }
    });

    return models.job.findOne({
        where: { id },
        ...includeForFind(language.id)
    });
}

const all = async (language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.job.all, { language });

    language = await models.language.findOne({
        where: {
            code: language
        }
    });

    return models.job.findAll({
        ...includeForFind(language.id)
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