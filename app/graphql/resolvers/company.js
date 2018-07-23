const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, throwForbiddenError, getLanguageIdByCode } = require('./common');

const handleCompany = async (language, details, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.company.input, { language, details });

    if (details.id) {
        const company = await models.company.findOne({
            where: {
                id: details.id
            }
        });

        if (!company) return { status: false, error: 'Company not found' }
        if (company.ownerId != user.id) throwForbiddenError();
    }
    await models.sequelize.transaction(async t => {
        details.id = details.id || uuid();
        details.user_id = user.id;
        await models.company.upsert(details, { transaction: t });
        details.companyId = details.id;
        details.languageId = await getLanguageIdByCode(models, language);
        await models.companyText.upsert(details, { transaction: t });
        if (details.place) {
            details.place.companyId = details.id;
            await models.place.upsert(details.place, { transaction: t });
        }
    });

    return { status: true };
}

const company = async (id, language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.company.one, { id, language });

    return models.company.findOne({
        where: { id: id },
        ...includeForFind(await getLanguageIdByCode(models, language))
    });
}

const all = async (language, { models }) => {
    yupValidation(schema.company.all, { language });

    return models.company.findAll({
        ...includeForFind(await getLanguageIdByCode(models, language))
    })
};

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
            }
        ]
    }
};

const handleFAQ = async (language, details, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.company.faqInput, { language, details });

    const languageId = await getLanguageIdByCode(models, language);

    const company = await models.company.findOne({ where: { id: details.companyId } });
    if (!company)
        return { status: false, error: 'Company not found' };

    if (company.ownerId != user.id)
        throwForbiddenError();

    if (details.id && !await models.faq.findOne({ where: { id: details.id } }))
        return { status: false, error: 'FAQ not found' }

    await models.sequelize.transaction(async t => {
        details.id = details.id || uuid();
        await models.faq.upsert(details, { transaction: t });
        details.faqId = details.id;
        details.languageId = languageId;
        await models.faqText.upsert(details, { transaction: t });
    });

    return { status: true };
}

const setTags = async (language, tagsInput, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.company.tags, { language, tagsInput });

    // Get existing tags
    const languageId = await getLanguageIdByCode(models, language);

    const company = await models.company.findOne({ where: { id: tagsInput.companyId } });
    if (!company) return { status: false, error: 'Company not found' }
    if (company.ownerId != user.id) throwForbiddenError();

    const cleanInputTags = tagsInput.tags.map(item => item.trim().toLowerCase());

    const existingTags = await models.tag.findAll({
        include: [{
            association: 'i18n',
            where: {
                languageId,
                title: {
                    [models.Sequelize.Op.in]: cleanInputTags
                }
            },
        }]
    });

    let newTags = [];
    if (!existingTags.length) newTags = cleanInputTags
    else newTags = cleanInputTags.filter(item => !existingTags.find(el => el.i18n[0].title == item));

    if (newTags.length || existingTags.length) {
        await models.sequelize.transaction(async t => {
            if (newTags.length) {
                const createdTags = await models.tag.bulkCreate(newTags.map(_ => { }), { transaction: t });

                // Create tag texts - need tag_id from tags
                const mappedTagTexts = newTags.map((title, i) => {
                    return {
                        tagId: createdTags[i].id,
                        languageId,
                        title,
                    };
                });

                await models.tagText.bulkCreate(mappedTagTexts, { transaction: t });
                // Add new tags to user
                if (createdTags.length) await company.addTags(createdTags, { transaction: t });
            }

            // Add existing tags to user
            if (existingTags.length) await company.addTags(existingTags, { transaction: t });
        });
    }

    return { status: true };
}

const removeTag = async (id, companyId, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.company.removeTag, { id, companyId });

    const company = await models.company.findOne({ where: { id: companyId } });
    if (!company) return { status: false, error: 'Company not found' }
    if (company.ownerId != user.id) throwForbiddenError();

    const model = models.sequelize.define('companyTag', {
    }, {
            tableName: 'company_tags'
        });

    if (await model.destroy({
        where: {
            tag_id: id,
            company_id: companyId
        }
    })) {
        return { status: true };
    }

    return { status: false, error: 'Tag not found' };
}

module.exports = {
    handleCompany,
    handleFAQ,
    setTags,
    removeTag,
    all,
    company
}