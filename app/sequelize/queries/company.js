const includeForFind = (languageId) => {
    return {
        include: [
            {
                association: 'owner'
            },
            {
                association: 'i18n',
                where: { languageId }
            }, {
                association: 'teams',
                include: [
                    { association: 'members' }
                ]
            }, {
                association: 'jobs',
                include: [
                    { association: 'i18n', where: { languageId } },
                    { association: 'team' }
                ]
            }, {
                association: 'featuredArticles',
                include: [
                    { association: 'featuredImage', include: [{ association: 'i18n', where: { languageId } }] },
                    { association: 'images', include: [{ association: 'i18n', where: { languageId } }] },
                    { association: 'videos', include: [{ association: 'i18n', where: { languageId } }] },
                    { association: 'i18n', where: { languageId } }
                ]
            }, {
                association: 'officeArticles',
                include: [
                    { association: 'featuredImage', include: [{ association: 'i18n' }] },
                    { association: 'i18n', where: { languageId } },
                    { association: 'images', include: [{ association: 'i18n' }] },
                    { association: 'videos', include: [{ association: 'i18n', where: { languageId } }] }
                ]
            }, {
                association: 'storiesArticles',
                include: [
                    { association: 'featuredImage', include: [{ association: 'i18n' }] },
                    { association: 'i18n', where: { languageId } },
                    { association: 'images', include: [{ association: 'i18n' }] },
                    { association: 'videos', include: [{ association: 'i18n', where: { languageId } }] }
                ]
            }, {
                association: 'faqs',
                include: [
                    { association: 'i18n', where: { languageId } }
                ]
            }, {
                association: 'tags',
                include: [
                    { association: 'i18n', where: { languageId } }
                ]
            },
            { association: 'industry', include: [{ association: 'i18n' }] }
        ]
    }
};

const associationForUserProfile = (languageId) => ({
    include: [
        {
            association: 'i18n',
            where: { languageId }
        }, {
            association: 'teams',
            include: [
                { association: 'members' }
            ]
        }
    ]
});

module.exports = {
    includeForFind,
    associationForUserProfile
};