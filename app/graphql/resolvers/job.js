const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, getLanguageIdByCode, validateCompany, throwForbiddenError, encodeCursor, decodeCursor } = require('./common');

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
        // jobDetails.jobId = jobDetails.id;
        // jobDetails.languageId = languageId;
        // await models.jobText.upsert(jobDetails, { transaction: t });
        if (jobDetails.salary) {
            jobDetails.salary.jobId = jobDetails.id;
            await models.jobSalary.upsert(jobDetails.salary, { transaction: t });
        }

        job = await models.job.findOne({
            where: { id: jobDetails.id },
            attributes: ['id'],
            transaction: t
        });

        if (jobDetails.jobTypes)
            await job.setJobTypes(jobDetails.jobTypes, { transaction: t });


        // If no skills => leave as before
        if (jobDetails.skills) {
            let dbSkills = await models.skill.findAll({
                where: {
                    id: {
                        [models.Sequelize.Op.in]: jobDetails.skills
                    }
                },
                transaction: t
            });
    
            await job.setSkills(dbSkills, { transaction: t });

            // let dbSkills = await models.skill.findAll({
            //     where: {
            //         title: {
            //             [models.Sequelize.Op.in]: jobDetails.skills
            //         }
            //     },
            //     transaction: t
            // });
            // const newSkills = jobDetails.skills.filter(skill => !dbSkills.filter(dbSkill => dbSkill.title == skill).length);
            // if (newSkills.length) {
            //     await models.skill.bulkCreate(newSkills.map(title => ({ title })), { transaction: t });
            //     const newDbSkills = await models.skill.findAll({
            //         where: {
            //             title: {
            //                 [models.Sequelize.Op.in]: newSkills
            //             }
            //         },
            //         transaction: t
            //     });
            //     dbSkills = dbSkills.concat(newDbSkills);
            // }
            // await job.setSkills(dbSkills, { transaction: t });

            // const { createdSkills, existingSkills, associatedSkillsToRemove } = await storeSkills(jobDetails.skills, job.skills, languageId, models, t);

            // // Add new skills to job
            // if (createdSkills.length) await job.addSkills(createdSkills, { transaction: t });

            // // Add existing values to job
            // if (existingSkills.length) await job.addSkills(existingSkills, { transaction: t });

            // await job.removeSkills(associatedSkillsToRemove, { transaction: t });
        }

        // Benefits
        if (jobDetails.jobBenefits)
            await job.setJobBenefits(jobDetails.jobBenefits, { transaction: t });

        result = true;
    });

    return { status: result };
}

const storeActivityField = async (title, languageId, models, transaction) => {
    let activityField = await models.activityField.findOne({
        where: {
            title
        },
        transaction
    });
    if (!activityField) {
        activityField = await models.activityField.create({
            title,
            createdAt: new Date(),
            updatedAt: new Date()
        }, { transaction });
    }

    return activityField.id;
}

const job = async (id, language, { user, models }) => {
    yupValidation(schema.job.one, { id, language });

    return models.job.findOne({
        where: { id },
        ...includeForFind(await getLanguageIdByCode(models, language), user ? user.id : null, models)
    });
}

const all = async (language, companyId, first, after, { models }) => {
    yupValidation(schema.job.all, { 
        language,
        companyId,
        first,
        after
    });

    let where = {
        status: 'active'
    };
    const order = [
        ['createdAt', 'desc'],
        ['id', 'asc']
    ];
    if (companyId) where.companyId = companyId;

    if (after) {
        after = decodeCursor(after);
        where = {
            ...where,
            [models.Sequelize.Op.and]: [
                ...(where[models.Sequelize.Op.and] ? where[models.Sequelize.Op.and] : []),
                {
                    createdAt: {
                        [models.Sequelize.Op.lte]: after.date
                    }
                },
                {
                    [models.Sequelize.Op.or]: [{
                        createdAt: {
                            [models.Sequelize.Op.ne]: after.date
                        }
                    }, {
                        id: {
                            [models.Sequelize.Op.gt]: after.id
                        }
                    }]
                }
            ]
        }
    }

    let jobsIds = await models.job.findAll({
        where,
        attributes: ['id'],
        order,
        limit: first + 1
    });
    
    const hasNextPage = jobsIds.length === first + 1;
    jobsIds = hasNextPage ? jobsIds.slice(0, jobsIds.length -1) : jobsIds;

    if (jobsIds && jobsIds.length) {
        return models.job.findAll({
            where: {
                id: { [models.Sequelize.Op.in]: jobsIds.map(job => job.id) }
            },
            ...includeForFind(await getLanguageIdByCode(models, language), null, models),
            order,
        }).then(jobs => ({
            edges: jobs.map(job => ({
                node: job,
                cursor: encodeCursor({ id: job.id, date: job.createdAt})
            })),
            pageInfo: {
                hasNextPage
            }
        }));
    }
    return {
        edges: [],
        pageInfo: {
            hasNextPage: false
        }
    };
}

const jobTypes = async (language, { models }) => {
    yupValidation(schema.job.jobTypes, { language });

    const languageId = await getLanguageIdByCode(models, language);

    return models.jobType.findAll({
        // include: [
        //     { association: 'i18n', where: { languageId } }
        // ]
    });
}

const jobBenefits = async ({ models }) => {
    return models.jobBenefit.findAll({});
}

const includeForFind = (languageId, userId, models) => {
    return {
        include: [
            // { association: 'i18n', where: { languageId } },
            { association: 'team' },
            {
                association: 'company',
                include: [
                    // {
                    //     association: 'i18n', where: { languageId }
                    // },
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
                        // include: [
                        //     { association: 'i18n', where: { languageId } }
                        // ]
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
                // include: [
                //     { association: 'i18n', where: { languageId } }
                // ]
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
                // include: [
                //     { association: 'i18n', where: { languageId } }
                // ]
            }, {
                association: 'skills',
                // include: [
                //     { association: 'i18n', where: { languageId } }
                // ]
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
        jobs: (_, { language, companyId, first, after }, context) => all(language, companyId, first, after, context),
        job: (_, { id, language }, context) => job(id, language, context),
        jobTypes: (_, { language }, context) => jobTypes(language, context),
        jobBenefits: (_, { }, context) => jobBenefits(context)
    },
    Mutation: {
        handleJob: (_, { language, jobDetails }, context) => handleJob(language, jobDetails, context),
        handleApplyToJob: (_, { jobId, isApplying }, context) => handleApplyToJob(jobId, isApplying, context)
    }
}