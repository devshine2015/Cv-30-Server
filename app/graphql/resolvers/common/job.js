const { getLanguageIdByCode, encodeCursor, decodeCursor, validateCompany } = require('./common');

const all = async (language, companyId, status, first, after, { user, models }) => {
    let forbidden = false;
    if (status !== 'active') {
        if (!companyId) forbidden = true;

        if (user) {
            const companyOk = await validateCompany(jobDetails.companyId, user, models);
            if (companyOk !== true) forbidden = true;
        }
    }

    if (forbidden) {
        return {
            edges: [],
            pageInfo: {
                hasNextPage: false
            }
        };
    }

    let where = {
        status
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

module.exports = {
    all,
    includeForFind
}