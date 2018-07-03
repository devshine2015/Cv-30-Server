const uuid = require('uuidv4');
const schema = require('../validation');

const profile = async (id, language, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });
    }
    if (errors.length)
        throw new Error(errors);
    console.log(await createProfileResponse(user, models))
    return await createProfileResponse(user, models);
}
const all = async (language, { models }) => {
    language = await models.language.findOne({
        where: {
            code: language
        }
    });
    return models.user.findAll({
        where: {},
        include: [
            { association: 'skills', include: [{ association: 'i18n' }] },
            { association: 'values', include: [{ association: 'i18n' }] },
            { association: 'profile' },
            { association: 'aboutMeArticles', include: [{ association: 'featuredImage' }, { association: 'i18n' }] },
            { association: 'contact' }
        ]
    })
};

const setAvatar = async (status, { user, models }) => {
    const errors = [];

    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    if (errors.length) throw new Error(errors);
    try {
        if (models.profile.upsert({ userId: user.id, hasAvatar: status })) {
            return await createProfileResponse(user, models);

        }
    } catch (err) {
        console.log(error);
        return {
            status: false,
            error: "We did not manage to store your profile picture"
        };
    }
}

const setHasProfileCover = async (status, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    console.log(user);
    if (errors.length) throw new Error(errors);
    try {
        await models.profile.upsert({ userId: user.id, hasProfileCover: status });
        return await createProfileResponse(user, models);
    } catch (error) {
        console.log(error);
        return {
            status: false,
            error: "We did not manage to store your profile cover"
        };
    }
}

const setCoverBackground = async (color, { user, models }) => {
    const errors = [];
    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }

    if (errors.length) throw new Error(errors);

    try {
        if (await models.profile.upsert({ userId: user.id, coverBackground: color }))
            return await createProfileResponse(user, models);
    } catch (error) {
        console.log(error);
        return {
            status: false,
            error: "We did not manage to store your profile picture"
        };
    }
}

const setSalary = async ({ amount, currency, isPublic }, { user, models }) => {
    validateUser(user);

    try {
        schema.user.salary.validateSync({
            amount,
            currency,
            isPublic
        }, { abortEarly: false });
    } catch (error) {
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

    const response = {
        status: false,
        error: ''
    };

    try {
        await models.salary.upsert({
            userId: user.id,
            amount,
            currency,
            isPublic
        });

        response.status = true;
    } catch (error) {
        console.log(error);
        response.error = 'We did not manage to store your salary'
    }

    return response;
}

const setStory = async (language, { title, description }, { user, models }) => {
    validateUser(user);

    try {
        schema.user.story.validateSync({
            language,
            title,
            description
        }, { abortEarly: false });
    } catch (error) {
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

    const response = {
        status: false,
        error: ''
    };

    language = await models.language.findOne({
        where: {
            code: language
        }
    });

    try {
        await models.story.upsert({
            userId: user.id
        });
        await models.storyText.upsert({
            userId: user.id,
            languageId: language.id,
            title,
            description
        });
        response.status = true;
    } catch (error) {
        console.log(error);
        response.error = 'We did not manage to store your salary'
    }

    return response;
}

const setValues = async (values, language, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    try {
        schema.user.values.validateSync({
            language,
            values
        }, { abortEarly: false });
    } catch (error) {
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
    // Get existing values
    const languageModel = await models.language.findOne({
        where: {
            code: language
        }
    });

    const cleanedInputValues = values.map(item => item.trim().toLowerCase());

    const existingValues = await models.value.findAll({
        include: [{
            association: 'i18n',
            where: {
                languageId: languageModel.dataValues.id,
                title: {
                    [models.Sequelize.Op.in]: cleanedInputValues
                }
            },
        }]
    });

    let newValues = [];
    if (!existingValues.length) newValues = cleanedInputValues
    else newValues = cleanedInputValues.filter(item => !existingValues.find(el => el.i18n[0].title == item));

    if (newValues.length || existingValues.length) {
        await models.sequelize.transaction(async t => {
            if (newValues.length) {
                const createdValues = await models.value.bulkCreate(newValues.map(_ => { }), { transaction: t });

                // Create value texts - need value_id from values
                const mappedValueTexts = newValues.map((title, i) => {
                    return {
                        valueId: createdValues[i].dataValues.id,
                        languageId: languageModel.id,
                        title,
                    };
                });

                await models.valueText.bulkCreate(mappedValueTexts, { transaction: t });
                // Add new values to user
                if (createdValues.length) await user.addValues(createdValues, { transaction: t });
            }

            // Add existing values to user
            if (existingValues.length) await user.addValues(existingValues, { transaction: t });
        });
    }
    response.status = true;
    return response;
}

const removeValue = async (id, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    if (await models.userValues.destroy({
        where: {
            value_id: id,
            user_id: user.id
        }
    })) {
        response.status = true;
    } else {
        response.error = 'Value not found';
    }

    return response;
}

const setSkills = async (skills, language, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    try {
        schema.user.skills.validateSync({
            language,
            skills
        }, { abortEarly: false });
    } catch (error) {
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
    // Get existing values
    const languageModel = await models.language.findOne({
        where: {
            code: language
        }
    });

    const cleanedInputSkills = skills.map(item => item.trim().toLowerCase());

    const existingSkills = await models.skill.findAll({
        include: [{
            association: 'i18n',
            where: {
                languageId: languageModel.dataValues.id,
                title: {
                    [models.Sequelize.Op.in]: cleanedInputSkills
                }
            },
        }]
    });

    let newSkills = [];
    if (!existingSkills.length) newSkills = cleanedInputSkills
    else newSkills = cleanedInputSkills.filter(item => !existingSkills.find(el => el.i18n[0].title == item));

    if (newSkills.length || existingSkills.length) {
        await models.sequelize.transaction(async t => {
            if (newSkills.length) {
                const createdSkills = await models.skill.bulkCreate(newSkills.map(_ => { }), { transaction: t });

                // Create skill texts - need skill_id from skills
                const mappedSkillTexts = newSkills.map((title, i) => {
                    return {
                        skillId: createdSkills[i].dataValues.id,
                        languageId: 1,
                        title,
                    };
                });

                await models.skillText.bulkCreate(mappedSkillTexts, { transaction: t });
                // Add new skills to user
                if (createdSkills.length) await user.addSkills(createdSkills, { transaction: t });
            }

            // Add existing values to user
            if (existingSkills.length) await user.addSkills(existingSkills, { transaction: t });
        });
    }
    response.status = true;
    return response;
}

const removeSkill = async (id, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    if (await models.userSkills.destroy({
        where: {
            skill_id: id,
            user_id: user.id
        }
    })) {
        response.status = true;
    } else {
        response.error = 'Skill not found';
    }

    return response;
}

const setContact = async ({ phone, email, facebook, linkedin }, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    try {
        schema.user.contact.validateSync({
            phone,
            email,
            facebook,
            linkedin
        }, { abortEarly: false });
    } catch (error) {
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

    await models.contact.upsert({
        userId: user.id,
        phone: phone ? phone.trim() : null,
        email: email ? email.trim() : null,
        facebook: facebook ? facebook.trim() : null,
        linkedin: linkedin ? linkedin.trim() : null
    });

    response.status = true;
    return response;
}

const setProject = async ({ id, location, isCurrent, position, company, startDate, endDate, title, description }, language, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    try {
        schema.user.project.validateSync({
            location,
            isCurrent,
            position,
            company,
            startDate,
            endDate,
            title,
            description,
            language
        }, { abortEarly: false });
    } catch (error) {
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

    // Get language
    const languageModel = await models.language.findOne({
        where: {
            code: language
        }
    });

    if (languageModel) {
        await models.project.upsert({
            id: id ? id : uuid(),
            userId: user.id,
            locationId: location,
            isCurrent,
            position,
            company,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            i18n: [{
                languageId: languageModel.dataValues.id,
                title,
                description
            }]
        });
        response.status = true;
    } else {
        response.error = 'Language not found!';
    }

    return response;
}

const removeProject = async (id, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    if (await models.project.destroy({ where: { id } })) {
        response.status = true;
    } else {
        response.error = 'Project not found';
    }

    return response;
}

const setExperience = async ({ id, location, isCurrent, position, company, startDate, endDate, title, description }, language, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    try {
        schema.user.experience.validateSync({
            location,
            isCurrent,
            position,
            company,
            startDate,
            endDate,
            title,
            description,
            language
        }, { abortEarly: false });
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

    const languageModel = await models.language.findOne({
        where: {
            code: language
        }
    });

    if (languageModel) {
        await models.sequelize.transaction(async t => {
            const experienceId = id ? id : uuid();
            await models.experience.upsert({
                id: experienceId,
                userId: user.id,
                locationId: location,
                isCurrent,
                position,
                company,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            }, { transaction: t });
            await models.experienceText.upsert({
                experienceId: experienceId,
                languageId: languageModel.dataValues.id,
                title,
                description
            }, { transaction: t });
        });
        response.status = true;
    } else {
        response.error = 'Language not found!';
    }

    return response;
}

const removeExperience = async (id, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    if (await models.experience.destroy({ where: { id } })) {
        response.status = true;
    } else {
        response.error = 'Experience not found';
    }

    return response;
}

const validateUser = (user) => {
    const errors = [];

    if (!user) {
        errors.push({
            name: 'Forbidden',
            message: 'Not allowed',
            statusCode: 403
        });

    }
    if (errors.length) {
        console.log(errors);
        throw new Error(errors);
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

const createProfileResponse = async (user, models) => {
    const newUser = await models.user.findOne({
        where: {
            id: user.id
        },
        include: [
            { association: 'skills', include: [{ association: 'i18n' }] },
            { association: 'values', include: [{ association: 'i18n' }] },
            { association: 'profile', include: [{ association: 'salary' }] },
            { association: 'articles' },
            { association: 'experience', include: [{ association: 'i18n' }] },
            { association: 'projects', include: [{ association: 'i18n' }] },
            { association: 'contact' },
            { association: 'featuredArticles' }
        ]
    });
    const profile = newUser.profile ? await newUser.profile.get() : {};
    return {
        ...await newUser.get(),
        ...profile
    };
}

module.exports = {
    profile,
    setAvatar,
    setHasProfileCover,
    setCoverBackground,
    setSalary,
    setStory,
    setValues,
    removeValue,
    setSkills,
    removeSkill,
    setContact,
    setProject,
    removeProject,
    setExperience,
    removeExperience,
    validateUser,
    yupValidation,
    all
};