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

const all = async (language, { models }) => {
    language = await models.language.findOne({
        where: {
            code: language
        }
    });

    return models.job.findAll(
        {
            include: [
                { association: 'i18n', where: { languageId: language.id } },
                { association: 'team' },
                { association: 'company', include: [{ association: 'i18n', where: { languageId: language.id } }] }
            ]
        });
}

module.exports = {
    handleJob,
    all
}