const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, getLanguageIdByCode, validateCompany, throwForbiddenError } = require('./common');

const handleJob = async (language, jobDetails, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.job.input, {
        language,
        jobDetails
    });

    // Check that existing job belongs to the user
    let job = undefined;
    if (jobDetails.id) {
        job = await models.job.findOne({
            attributes: ["id", "companyId", "teamId"],
            include: [{
                association: 'company',
                attributes: ["id", "ownerId"]
            }],
            where: { id: jobDetails.id }
        });
    }
    if (job) {
        if (job.company.ownerId != user.id) throwForbiddenError();
        jobDetails.companyId = job.company.id;
        jobDetails.teamId = job.teamId;
    } else {
        const companyOk = await validateCompany(jobDetails.companyId, user, models);
        if (companyOk !== true) return companyOk;
    }

    await models.sequelize.transaction(async t => {
        jobDetails.id = jobDetails.id || uuid();
        await models.job.upsert(jobDetails, { transaction: t });
        jobDetails.jobId = jobDetails.id;
        jobDetails.languageId = await getLanguageIdByCode(models, language);
        await models.jobText.upsert(jobDetails, { transaction: t });
    });

    return { status: true };
}

const job = async (id, language, { models }) => {
    yupValidation(schema.job.one, { id, language });

    return models.job.findOne({
        where: { id },
        ...includeForFind(await getLanguageIdByCode(models, language))
    });
}

const all = async (language, companyId, { models }) => {
    yupValidation(schema.job.all, { language, companyId });

    return models.job.findAll({
        where: companyId ? { companyId } : {},
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
                    },
                    { association: 'owner' }
                ]
            }, {
                association: 'applicants',
                include: [
                    { association: 'skills', include: [{ association: 'i18n', where: { languageId } }] },
                    { association: 'values', include: [{ association: 'i18n', where: { languageId } }] },
                    { association: 'profile', include: [{ association: 'salary' }] },
                    { association: 'articles' },
                    { association: 'experience', include: [{ association: 'i18n', where: { languageId } }, { association: 'videos' }, { association: 'images' }] },
                    { association: 'projects', include: [{ association: 'i18n', where: { languageId } }, { association: 'videos' }, { association: 'images' }] },
                    { association: 'story', include: [{ association: 'i18n', where: { languageId } }] },
                    { association: 'contact' }
                ]
            }
        ]
    }
}

const handleApplyToJob = async (jobId, isApplying, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.job.handleApplyToJob, { jobId, isApplying });

    const job = await models.job.findOne({ attributes: ["id"], where: { id: jobId } });
    if (!job) return { status: false, error: 'Job not found' };
    if (isApplying)
        await job.addApplicant(user);
    else
        await job.removeApplicant(user);

    return { status: true };
}

module.exports = {
    Query: {
        jobs: (_, { language, companyId }, context) => all(language, companyId, context),
        job: (_, { id, language }, context) => job(id, language, context)
    },
    Mutation: {
        handleJob: (_, { language, jobDetails }, context) => handleJob(language, jobDetails, context),
        handleApplyToJob: (_, { jobId, isApplying }, context) => handleApplyToJob(jobId, isApplying, context)
    }
}