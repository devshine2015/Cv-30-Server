const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation } = require('./common');

const profile = async (id, language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.user.profile, { id, language});

    if (id) {
        user = await models.user.findOne({ where: { id: id }, attributes: ['id']});
        if (!user) return { status: false, error: 'User not found'};
        return await createProfileResponse(user, models);
    } else {
        return await createProfileResponse(user, models);
    }
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
            { association: 'contact' },
            { association: 'currentExperience' },
            { association: 'currentProject', include: [{ association: 'i18n', where: { languageId: language.id } }] }
        ]
    })
    .then(users => users.map(item => ({
            ...item.get(),
            currentPosition: {
                experience: item.currentExperience,
                // team: item.getCurrentTeams(),
                // position: item.getCurrentPosition(),
                project: item.currentProject
            }
        })
    ))
};

const setAvatar = async (status, { user, models }) => {
    checkUserAuth(user);
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
    checkUserAuth(user);
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
    checkUserAuth(user);

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
    checkUserAuth(user);
    yupValidation(schema.user.salary, {
        amount,
        currency,
        isPublic
    });

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
    checkUserAuth(user);
    yupValidation(schema.user.story, {
        language,
        title,
        description
    });

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
        await models.sequelize.transaction(async t => {
            await models.story.upsert({
                userId: user.id
            }, {
                transaction: t
            });
            await models.storyText.upsert({
                userId: user.id,
                languageId: language.id,
                title,
                description
            }, {
                transaction: t
            });
            response.status = true;
        })
    } catch (error) {
        console.log(error);
        response.error = 'We did not manage to store your salary'
    }

    return response;
}

const setValues = async (values, language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.user.value, {
        language,
        values
    });
    
    let response = {
        status: false,
        error: ''
    };

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
    checkUserAuth(user);

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
    checkUserAuth(user);
    yupValidation(schema.user.skills, {
        language,
        skills
    });

    let response = {
        status: false,
        error: ''
    };

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
    checkUserAuth(user);

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
    checkUserAuth(user);
    yupValidation(schema.user.contact, {
        phone,
        email,
        facebook,
        linkedin
    });

    let response = {
        status: false,
        error: ''
    };

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
    checkUserAuth(user);
    yupValidation(schema.user.project, {
        location,
        isCurrent,
        position,
        company,
        startDate,
        endDate,
        title,
        description,
        language
    });

    const response = {
        status: false,
        error: ''
    };

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
    checkUserAuth(user);

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
    checkUserAuth(user);
    yupValidation(schema.user.experience, {
        location,
        isCurrent,
        position,
        company,
        startDate,
        endDate,
        title,
        description,
        language
    });

    let response = {
        status: false,
        error: ''
    };

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
    checkUserAuth(user);

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
    all
};