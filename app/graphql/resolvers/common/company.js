// When you modify this, check it's usages since it might be multiple used
const commonCompanySubQueriesParams = (languageId) => [
    {
        include: { association: 'owner' },
        allAttributes: true
    },
    // {
    //     include: {
    //         association: 'i18n',
    //         where: { languageId }
    //     }
    // },
    {
        include: {
            association: 'teams',
            include: [
                { association: 'members' }
            ]
        }
    },
    {
        include: {
            association: 'jobs',
            where: {
                status: 'active'
            },
            order: [['createdAt', 'desc']],
            include: [
                // { association: 'i18n', where: { languageId } },
                { association: 'team' }
            ],
            limit: 5
        },
        then: (company) => ({
            recentJobs: company.jobs
        })
    },
    {
        include: {
            association: 'featuredArticles',
            include: [
                { association: 'featuredImage'/*, include: [{ association: 'i18n', where: { languageId } }] */},
                { association: 'images'/*, include: [{ association: 'i18n', where: { languageId } }] */},
                { association: 'videos'/*, include: [{ association: 'i18n', where: { languageId } }] */},
                // { association: 'i18n', where: { languageId } }
            ]
        }
    },
    {
        include: {
            association: 'officeArticles',
            include: [
                { association: 'featuredImage'/*, include: [{ association: 'i18n' }] */},
                // { association: 'i18n', where: { languageId } },
                { association: 'images'/*, include: [{ association: 'i18n' }] */},
                { association: 'videos'/*, include: [{ association: 'i18n', where: { languageId } }] */}
            ]
        }
    },
    {
        include: {
            association: 'storiesArticles',
            include: [
                { association: 'featuredImage'/*, include: [{ association: 'i18n' }] */},
                // { association: 'i18n', where: { languageId } },
                { association: 'images'/*, include: [{ association: 'i18n' }] */},
                { association: 'videos'/*, include: [{ association: 'i18n', where: { languageId } }] */}
            ]
        }
    },
    {
        include: {
            association: 'faqs',
            // include: [
            //     { association: 'i18n', where: { languageId } }
            // ]
        }
    },
    {
        include: {
            association: 'tags',
            // include: [
            //     { association: 'i18n', where: { languageId } }
            // ]
        }
    },
    { 
        include: {
            association: 'industry',
            // include: [
            //     { association: 'i18n' }
            // ]
        }
    }
];

const companySubQueriesParams = (languageId) => (commonCompanySubQueriesParams(languageId))

const companiesSubQueriesParams = (languageId) => {
    const filter = ['owner'/*, 'i18n'*/, 'industry', 'jobs', 'teams'];
    return commonCompanySubQueriesParams(languageId).filter((item) => filter.findIndex(el => item.include.association === el) !== -1);
}

const associationForUserProfile = (languageId) => ({
    include: [
        // {
        //     association: 'i18n',
        //     where: { languageId }
        // },
        {
            association: 'teams',
            include: [
                { association: 'members' }
            ]
        }
    ]
});

module.exports = {
    companySubQueriesParams,
    companiesSubQueriesParams,
    associationForUserProfile
};