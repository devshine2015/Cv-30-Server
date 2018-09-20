const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, getLanguageIdByCode, validateCompany, findOneFromSubQueries, findAllFromSubQueries } = require('./common');
const { companySubQueriesParams, companiesSubQueriesParams } = require('../../sequelize/queries/company');

const handleCompany = async (language, details, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.company.input, { language, details });

    if (details.id) {
        const companyOk = await validateCompany(details.id, user, models);
        if (companyOk !== true) return companyOk;
    }
    //const languageId = await getLanguageIdByCode(models, language);

    if (details.industryId) {
        const foundIndustry = await models.industry.findOne({ 
            where: { 
                id: details.industryId
            }}
        );
        if (!foundIndustry)
            return { status: false, error: 'Industry not found!' };
    }

    await models.sequelize.transaction(async transaction => {
        details.id = details.id || uuid();
        details.user_id = user.id;
        await models.company.upsert(details, { transaction });
        // details.companyId = details.id;
        // details.languageId = languageId;
        // await models.companyText.upsert(details, { transaction });
    });

    return { status: true };
}

const storeIndustry = async (title, languageId, models, transaction) => {
    let industry = await models.industry.findOne({
        where: {
            title
        },
        attributes: [ 'id' ],
        transaction
    });

    if (!industry) {
        industry = await models.industry.create({
            title,
            createdAt: new Date(),
            updatedAt: new Date()
        }, { transaction });
        // industryText = await models.industryText.create({
        //     industryId: industry.id,
        //     languageId,
        //     title,
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // }, { transaction });
    }

    return industry.id;
}

const company = async (id, language, { models }) => {
    yupValidation(schema.company.one, { id, language });

    return await findOneFromSubQueries(
        companySubQueriesParams(await getLanguageIdByCode(models, language)),
        models.company,
        { id }
    );
}

const all = async (language, { models }) => {
    yupValidation(schema.company.all, { language });

    return await findAllFromSubQueries(
        companiesSubQueriesParams(await getLanguageIdByCode(models, language)),
        models.company
    );
};

const industries = async (language, { models }) => {
    yupValidation(schema.company.all, { language });

    const languageId = await getLanguageIdByCode(models, language);
    return models.industry.findAll({
        // include: [
        //     { association: 'i18n', where: { languageId } }
        // ]
    })
}

const handleFAQ = async (language, details, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.company.faqInput, { language, details });

    const languageId = await getLanguageIdByCode(models, language);

    const companyOk = await validateCompany(details.companyId, user, models);
    if (companyOk !== true) return companyOk;

    if (details.id && !await models.faq.findOne({ where: { id: details.id } }))
        return { status: false, error: 'FAQ not found' }

    await models.sequelize.transaction(async transaction => {
        if (details.remove) {
            await models.faq.destroy({where: { id: details.id }});
            // await models.faqText.destroy({where: { faqId: details.id }});
        } else {
            details.id = details.id || uuid();
            await models.faq.upsert(details, { transaction });
            // details.faqId = details.id;
            // details.languageId = languageId;
            // await models.faqText.upsert(details, { transaction });
        }
    });

    return { status: true };
}

const setTags = async (language, tagsInput, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.company.tags, { language, tagsInput });

    // Get existing tags
    const languageId = await getLanguageIdByCode(models, language);

    const companyOk = await validateCompany(tagsInput.companyId, user, models);
    if (companyOk !== true) return companyOk;

    const cleanInputTags = tagsInput.tags.map(item => item.trim().toLowerCase());

    const existingTags = await models.tag.findAll({
        /*include: [{
            association: 'i18n',
            where: {
                languageId,
                title: {
                    [models.Sequelize.Op.in]: cleanInputTags
                }
            },
        }]*/
    });

    let newTags = [];
    if (!existingTags.length) newTags = cleanInputTags
    else newTags = cleanInputTags.filter(item => !existingTags.find(el => el.i18n[0].title == item));

    if (newTags.length || existingTags.length) {
        await models.sequelize.transaction(async t => {
            const company = await models.company.findOne({ attributes: ["id", "ownerId"], where: { id }, transaction: t } );

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

    const companyOk = await validateCompany(companyId, user, models);
    if (companyOk !== true) return companyOk;

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
    Query: {
        companies: (_, { language }, context) => all(language, context),
        company: (_, { id, language }, context) => company(id, language, context),
        industries: (_, { language }, context) => industries(language, context)
    },
    Mutation: {
        handleCompany: (_, { language, details }, context) => handleCompany(language, details, context),
        setTags: (_, { language, tagsInput }, context) => setTags(language, tagsInput, context),
        removeTag: (_, { id, companyId }, context) => removeTag(id, companyId, context),
        handleFAQ: (_, { language, faq }, context) => handleFAQ(language, faq, context)
    }
}