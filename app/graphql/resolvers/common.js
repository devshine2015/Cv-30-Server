const checkUserAuth = (user) => {
    if (!user)
        throwForbiddenError();
}

const throwForbiddenError = () => {
    const errors = [ forbiddenError() ];
    throw new Error(JSON.stringify(errors));
}

const forbiddenError = () => {
    return {
        name: 'Forbidden',
        message: 'Not allowed',
        statusCode: 403
    }
}

const yupValidation = (yupValidator, input) => {
    try {
        yupValidator.validateSync(input, { abortEarly: false });
    } catch (error) {
        console.log(error);
        throw new Error(
            JSON.stringify(
                error.inner.map(err => ({
                    path: err.path,
                    type: err.type,
                    message: err.message
                }))
            )
        );
    }
}

const getLanguageByCode = async (models, code, attributes = ["id"]) => {
    return models.language.findOne({
        attributes,
        where: {
            code
        }
    });
}

const getLanguageIdByCode = async (models, code, attributes = ["id"]) => {
    return (await models.language.findOne({
        attributes,
        where: {
            code
        }
    })).id;
}

const validateCompany = async (id, user, models) => {
    const company = await models.company.findOne({ attributes: ["id", "ownerId"], where: { id } });

    if (!company) return { status: false, error: 'Company not found' };
    if (company.ownerId !== user.id) throwForbiddenError();
    
    return true;
}

const validateTeam = async (id, user, models) => {
    const team = await models.team.findOne({
        attributes: ["id"], 
        where: { id },
        include: [
            { association: 'company', attributes: ["id", "ownerId"] }
        ]
    });
    if (!team) return { status: false, error: 'Team not found' }
    if (team.company.ownerId !== user.id) throwForbiddenError();

    return true;
}

const validateArticle = async (id, user, models, options = { 
    testFoundArticle: true
}) => {
    const foundArticle = await models.article.findOne({ attributes: ["id", "ownerId"], where: { id } });
    if (options.testFoundArticle && !foundArticle) return { status: false, error: 'Article not found' }
    if (foundArticle && foundArticle.ownerId !== user.id) throwForbiddenError();

    return true;
}

const storeSkills = async (skills, languageId, models, transaction) => {
    const cleanedInputSkills = skills.map(item => item.trim().toLowerCase());

    const existingSkills = await models.skill.findAll({
        include: [{
            association: 'i18n',
            where: {
                languageId,
                title: {
                    [models.Sequelize.Op.in]: cleanedInputSkills
                }
            },
        }],
        transaction
    });

    let newSkills = [];
    if (!existingSkills.length) newSkills = cleanedInputSkills
    else newSkills = cleanedInputSkills.filter(item => !existingSkills.find(el => el.i18n[0].title == item));

    let createdSkills = [];
    if (newSkills.length) {
        createdSkills = await models.skill.bulkCreate(newSkills.map(_ => { }), { transaction });

        // Create skill texts - need skill_id from skills
        const mappedSkillTexts = newSkills.map((title, i) => {
            return {
                skillId: createdSkills[i].dataValues.id,
                languageId,
                title,
            };
        });

        const createdSkillTexts = await models.skillText.bulkCreate(mappedSkillTexts, { transaction });
        if (createdSkills.length !== newSkills.length || createdSkillTexts.length !== newSkills.length)
            throw new Error("Skill storage failed");
    }

    return { createdSkills, existingSkills };
}

module.exports = {
    checkUserAuth,
    yupValidation,
    forbiddenError,
    throwForbiddenError,
    getLanguageByCode,
    getLanguageIdByCode,
    validateCompany,
    validateTeam,
    validateArticle,
    storeSkills
}