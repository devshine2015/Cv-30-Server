const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, getLanguageIdByCode, validateCompany, throwForbiddenError, storeSkills } = require('./common');

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
    const languageId = await getLanguageIdByCode(models, language);

    let result = false;
    await models.sequelize.transaction(async t => {
        if (jobDetails.activityField) {
            jobDetails.activityFieldId = await storeActivityField(jobDetails.activityField, languageId, models, t);
        }
        jobDetails.id = jobDetails.id || uuid();
        await models.job.upsert(jobDetails, { transaction: t });
        jobDetails.jobId = jobDetails.id;
        jobDetails.languageId = languageId;
        await models.jobText.upsert(jobDetails, { transaction: t });
        if (jobDetails.salary) {
            jobDetails.salary.jobId = jobDetails.id;
            await models.jobSalary.upsert(jobDetails.salary, { transaction: t });
        }

        job = await models.job.findOne({ 
            where: { id: jobDetails.id },
            include: [{
                association: 'skills',
                attributes: ['id'],
                include: [
                    {
                        association: 'i18n',
                        where: { languageId },
                        attributes: ['title']
                    }
                ]
            }, {
                association: 'jobTypes',
                attributes: ['id'],
            }, {
                association: 'jobBenefits',
                attributes: ['id'],
            }],
            attributes: ['id'],
            transaction: t 
        });

        if (jobDetails.jobTypes) {
            const jobTypes = await models.jobType.findAll({
                where: {
                    id: {
                        [models.Sequelize.Op.in]: jobDetails.jobTypes
                    }
                },
                attributes: ['id'],
                transaction: t
            });

            if (jobTypes.length !== jobDetails.jobTypes.length) throw new Error("Invalid job types input");

            const jobTypesToRemove = job.jobTypes.filter(item => jobDetails.jobTypes.findIndex(el => el.id === item.id) === -1);
            await job.addJobTypes(jobTypes, { transaction: t });
            await job.removeJobTypes(jobTypesToRemove, { transaction: t })
        }
        // If no skills => leave as before
        if (jobDetails.skills) {
            const { createdSkills, existingSkills, associatedSkillsToRemove } = await storeSkills(jobDetails.skills, job.skills, languageId, models, t);

            // Add new skills to job
            if (createdSkills.length) await job.addSkills(createdSkills, { transaction: t });

            // Add existing values to job
            if (existingSkills.length) await job.addSkills(existingSkills, { transaction: t });

            await job.removeSkills(associatedSkillsToRemove, { transaction: t});
        }
        // Benefits
        if (jobDetails.jobBenefits) {
            const jobBenefits = await models.jobBenefit.findAll({
                where: {
                    id: {
                        [models.Sequelize.Op.in]: jobDetails.jobBenefits
                    }
                },
                attributes: ['id'],
                transaction: t
            });

            if (jobBenefits.length !== jobDetails.jobBenefits.length) throw new Error("Invalid job benefits input");
            const jobBenefitsToRemove = job.jobBenefits.filter(item => jobDetails.jobBenefits.findIndex(el => el.id === item.id) === -1);
            await job.addJobBenefits(jobBenefits, { transaction: t });
            await job.removeJobBenefits(jobBenefitsToRemove, { transaction: t })
        }

        result = true;
    });

    return { status: result };
}

const storeActivityField = async (title, languageId, models, transaction) => {
    let activityFieldText = await models.activityFieldText.findOne({
        where: {
            title,
            languageId
        },
        attributes: [ 'activityFieldId' ],
        transaction
    });
    if (!activityFieldText) {
        const activityField = await models.activityField.create({
            createdAt: new Date(),
            updatedAt: new Date()
        }, { transaction });
        activityFieldText = await models.activityFieldText.create({
            activityFieldId: activityField.id,
            languageId,
            title,
            createdAt: new Date(),
            updatedAt: new Date()
        }, { transaction });
    }

    return activityFieldText.activityFieldId;
}

const job = async (id, language, { user, models }) => {
    yupValidation(schema.job.one, { id, language });

    return models.job.findOne({
        where: { id },
        ...includeForFind(await getLanguageIdByCode(models, language), user ? user.id : null, models)
    });
}

const all = async (language, companyId, { models }) => {
    yupValidation(schema.job.all, { language, companyId });

    let where = {
        status: 'active'
    };
    if (companyId) where = { ...where, companyId };
    return models.job.findAll({
        where,
        ...includeForFind(await getLanguageIdByCode(models, language), null, models)
    });
}

const jobTypes = async (language, { models }) => {
    yupValidation(schema.job.jobTypes, { language });

    const languageId = await getLanguageIdByCode(models, language);

    return models.jobType.findAll({
        include: [
            { association: 'i18n', where: { languageId } }
        ]
    });
}

const jobBenefits = async ({ models }) => {
    return models.jobBenefit.findAll({ });
}

const includeForFind = (languageId, userId, models) => {
    return {
        include: [
            { association: 'i18n', where: { languageId } },
            { association: 'team' },
            {
                association: 'company',
                include: [
                    {
                        association: 'i18n', where: { languageId }
                    }, 
                    // {
                    //     association: 'officeArticles',
                    //     include: [
                    //         { association: 'featuredImage', include: [{ association: 'i18n', where: { languageId } }] },
                    //         { association: 'i18n', where: { languageId } },
                    //         { association: 'images', include: [{ association: 'i18n', where: { languageId } }] },
                    //         { association: 'videos', include: [{ association: 'i18n', where: { languageId } }] }
                    //     ]
                    // },
                    {
                        association: 'faqs',
                        include: [
                            { association: 'i18n', where: { languageId } }
                        ]
                    },
                    { association: 'owner' }
                ]
            }, {
                association: 'applicants',
                // include: [
                //     { association: 'skills', include: [{ association: 'i18n', where: { languageId } }] },
                //     { association: 'values', include: [{ association: 'i18n', where: { languageId } }] },
                //     { association: 'profile', include: [{ association: 'salary' }] },
                //     { association: 'articles' },
                //     { association: 'experience', include: [{ association: 'i18n', where: { languageId } }, { association: 'videos' }, { association: 'images' }] },
                //     { association: 'projects', include: [{ association: 'i18n', where: { languageId } }, { association: 'videos' }, { association: 'images' }] },
                //     { association: 'story', include: [{ association: 'i18n', where: { languageId } }] },
                //     { association: 'contact' }
                // ]
            }, {
                association: 'jobTypes',
                include: [
                    { association: 'i18n', where: { languageId } }
                ]
            }, { 
                association: 'salary',
                attributes: ['isPublic', 'amountMin', 'amountMax', 'currency'],
                required: false,
                where: { 
                    [models.Sequelize.Op.or]: [
                        { isPublic: { [models.Sequelize.Op.eq]: true } },
                        { '$company.owner.id$': { [models.Sequelize.Op.eq]: userId } }
                    ]
                }
            }, {
                association: 'activityField',
                include: [
                    { association: 'i18n', where: { languageId } }
                ]
            }, {
                association: 'skills',
                include: [
                    { association: 'i18n', where: { languageId } }
                ]
            }, {
                association: 'jobBenefits'
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
        job: (_, { id, language }, context) => job(id, language, context),
        jobTypes: (_, { language }, context) => jobTypes(language, context),
        jobBenefits: (_, { }, context) => jobBenefits(context)
    },
    Mutation: {
        handleJob: (_, { language, jobDetails }, context) => handleJob(language, jobDetails, context),
        handleApplyToJob: (_, { jobId, isApplying }, context) => handleApplyToJob(jobId, isApplying, context)
    }
}