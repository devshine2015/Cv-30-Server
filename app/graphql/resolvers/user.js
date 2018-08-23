const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, getLanguageIdByCode, storeSkills } = require('./common');
const { associationForUserProfile: companyAssociationForUserProfile } = require("../../sequelize/queries/company");

const profile = async (id, language, { user, models }) => {
    yupValidation(schema.user.one, { id, language });
    const languageId = await getLanguageIdByCode(models, language);

    if (id) {
        user = await models.user.findOne({ where: { id: id }, attributes: ['id'] });
        if (!user) return { status: false, error: 'User not found' };
        return await createProfileResponse(user, models, languageId);
    } else {
        return await createProfileResponse(user, models, languageId);
    }
}
const all = async (language, { models }) => {
    yupValidation(schema.user.all, { language });

    const languageId = await getLanguageIdByCode(models, language);

    return models.user.findAll({
        where: {},
        include: [
            { association: 'skills', include: [{ association: 'i18n' }] },
            { association: 'values', include: [{ association: 'i18n' }] },
            {
                association: 'ownedCompanies',
                ...companyAssociationForUserProfile(languageId)
            },
            { association: 'profile', include: [{ association: 'salary' }] },
            { association: 'aboutMeArticles', include: [{ association: 'featuredImage' }, { association: 'i18n' }] },
            { association: 'contact' },
            { association: 'currentExperience' },
            { association: 'currentProject', include: [{ association: 'i18n', where: { languageId } }] }
        ]
    })
        .then(users => users.map(item => {
            return {
                ...item.get(),
                ...(item.profile ? item.profile.get() : {}),
                currentPosition: {
                    experience: item.currentExperience,
                    // team: item.getCurrentTeams(),
                    // position: item.getCurrentPosition(),
                    project: item.currentProject
                }
            }
        }))
};

const setAvatar = async (status, contentType, path, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.user.setAvatar, { status, contentType, path });

    try {
        if (await models.profile.upsert({
            userId: user.id,
            hasAvatar: status,
            avatarContentType: contentType,
            avatarPath: path
        })) {
            return { status: true };
        }
    } catch (err) {
        console.log(error);
        return {
            status: false,
            error: "We did not manage to store your profile picture"
        };
    }
}

const setProfileCover = async (status, contentType, path, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.user.setProfileCover, { status, contentType, path });

    try {
        await models.profile.upsert({ 
            userId: user.id,
            hasProfileCover: status,
            profileCoverContentType: contentType,
            coverPath: path
        });
        return { status: true };
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
            return { status: true };
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

    const languageId = await getLanguageIdByCode(models, language)

    try {
        await models.sequelize.transaction(async t => {
            await models.story.upsert({
                userId: user.id
            }, {
                    transaction: t
                });
            await models.storyText.upsert({
                userId: user.id,
                languageId,
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

const setValues = async (addValues, removeValues, language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.user.values, {
        language,
        addValues,
        removeValues
    });

    // Get existing values
    const languageId = await getLanguageIdByCode(models, language);

    const cleanedInputValues = addValues.map(item => item.trim().toLowerCase());

    const existingValues = await models.value.findAll({
        include: [{
            association: 'i18n',
            where: {
                languageId,
                title: {
                    [models.Sequelize.Op.in]: cleanedInputValues
                }
            },
        }]
    });

    let newValues = [];
    if (!existingValues.length) newValues = cleanedInputValues
    else newValues = cleanedInputValues.filter(item => !existingValues.find(el => el.i18n[0].title == item));

    let result = false;
    if (newValues.length || existingValues.length) {
        await models.sequelize.transaction(async transaction => {
            if (newValues.length) {
                const createdValues = await models.value.bulkCreate(newValues.map(_ => { }), { transaction });

                // Create value texts - need value_id from values
                const mappedValueTexts = newValues.map((title, i) => {
                    return {
                        valueId: createdValues[i].dataValues.id,
                        languageId,
                        title,
                    };
                });

                await models.valueText.bulkCreate(mappedValueTexts, { transaction });
                // Add new values to user
                if (createdValues.length) await user.addValues(createdValues, { transaction });
            }

            // Add existing values to user
            if (existingValues.length) await user.addValues(existingValues, { transaction });

            // Remove values
            if (removeValues.length) {
                const valuesToRemove = await models.value.findAll({
                    include: [{
                        association: 'i18n',
                        where: {
                            languageId,
                            title: {
                                [models.Sequelize.Op.in]: removeValues.map(item => item.trim().toLowerCase())
                            }
                        },
                    }],
                    transaction
                });

                await user.removeValues(valuesToRemove, { transaction });
            }
            result = true;
        });
    }
    return { status: result };
}

const setSkills = async (addSkills, removeSkills, language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.user.skills, {
        language,
        addSkills,
        removeSkills
    });

    // Get existing values
    const languageId = await getLanguageIdByCode(models, language);

    let result = false;
    await models.sequelize.transaction(async transaction => {
        const { createdSkills, existingSkills } = await storeSkills(addSkills, [], languageId, models, transaction);

        // Add new skills to user
        if (createdSkills.length) await user.addSkills(createdSkills, { transaction });

        // Add existing values to user
        if (existingSkills.length) await user.addSkills(existingSkills, { transaction });

        // Remove skills
        if (removeSkills.length) {
            const skillsToRemove = await models.skill.findAll({
                include: [{
                    association: 'i18n',
                    where: {
                        languageId,
                        title: {
                            [models.Sequelize.Op.in]: removeSkills.map(item => item.trim().toLowerCase())
                        }
                    },
                }],
                transaction
            });

            await user.removeSkills(skillsToRemove, { transaction });
        }

        result = true;
    });

    return { status: result };
}

const setContact = async ({ phone, email, facebook, linkedin }, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.user.contact, {
        phone,
        email,
        facebook,
        linkedin
    });

    await models.contact.upsert({
        userId: user.id,
        phone: phone ? phone.trim() : null,
        email: email ? email.trim() : null,
        facebook: facebook ? facebook.trim() : null,
        linkedin: linkedin ? linkedin.trim() : null
    });

    return { status: true };
}

const setProject = async ({ id, location, isCurrent, position, company, startDate, endDate, title, description, images, videos }, language, { user, models }) => {
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
        language,
        images,
        videos
    });

    // Get language
    const languageId = await getLanguageIdByCode(models, language);

    let result = false;
    await models.sequelize.transaction(async t => {
        const projectId = id ? id : uuid();
        await models.project.upsert({
            id: projectId,
            userId: user.id,
            location,
            isCurrent,
            position,
            company,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
        }, { transaction: t });
        await models.projectText.upsert({
            projectId,
            languageId,
            title,
            description
        }, { transaction: t });
        await upsertImages(images, languageId, projectId, user.id, models, t);
        await upsertVideos(videos, languageId, projectId, user.id, models, t);
        result = true;
    });
    return { status: result };
}

const removeProject = async (id, { user, models }) => {
    checkUserAuth(user);

    if (await models.project.destroy({ where: { id } })) {
        return { status: true };
    } else {
        return { status: false, error: 'Project not found' };
    }
}

const setExperience = async ({ id, location, isCurrent, position, company, startDate, endDate, title, description, images, videos }, language, { user, models }) => {
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
        language,
        images,
        videos
    });

    const languageId = await getLanguageIdByCode(models, language);

    let result = false;
    await models.sequelize.transaction(async t => {
        const experienceId = id ? id : uuid();
        await models.experience.upsert({
            id: experienceId,
            userId: user.id,
            location,
            isCurrent,
            position,
            company,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
        }, { transaction: t });
        await models.experienceText.upsert({
            experienceId: experienceId,
            languageId,
            title,
            description
        }, { transaction: t });
        await upsertImages(images, languageId, experienceId, user.id, models, t);
        await upsertVideos(videos, languageId, experienceId, user.id, models, t);
        result = true;
    });
    return { status: result };
}

const removeExperience = async (id, { user, models }) => {
    checkUserAuth(user);

    if (await models.experience.destroy({ where: { id } })) {
        return { status: true };
    } else {
        return { status: false, error: 'Experience not found' };
    }
}

const upsertImages = async (images, languageId, sourceId, userId, models, transaction) => {
    if (images && images.length > 0) {
        await Promise.all(images.map(item => models.image.upsert({
            id: item.id,
            userId,
            isFeatured: item.isFeatured,
            sourceId: item.source ? item.source : sourceId,
            sourceType: item.sourceType,
            path: item.path
        }, {
                updateOnDuplicate: ["isFeatured", "path"],
                transaction
            })));
        await Promise.all(images.map(item => models.imageText.upsert({
            imageId: item.id,
            title: item.title,
            description: item.description,
            languageId
        }, {
                updateOnDuplicate: ["title", "description"],
                transaction
            })));
    }
}

const upsertVideos = async (videos, languageId, sourceId, userId, models, transaction) => {
    if (videos && videos.length > 0) {
        await Promise.all(videos.map(item => models.video.upsert({
            id: item.id,
            userId,
            isFeatured: item.isFeatured ? item.isFeatured : false,
            sourceId: item.source ? item.source : sourceId,
            sourceType: item.sourceType,
            path: item.path
        }, {
                updateOnDuplicate: ["isFeatured", "path"],
                transaction
            })));
        // await models.videoText.upsert(videos.map(item => ({
        //     videoId: item.id,
        //     title: item.title,
        //     description: item.description,
        //     languageId
        // })), {
        //     updateOnDuplicate: ["title", "description"],
        //     transaction
        // });
    }
}

const handleFollow = async ({ userToFollowId, companyId, jobId, teamId, isFollowing }, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.user.handleFollow, {
        userToFollowId,
        companyId,
        jobId,
        teamId,
        isFollowing
    });

    let userToFollow = undefined;
    let company = undefined;
    let job = undefined;
    let team = undefined;

    if (userToFollowId) {
        userToFollow = await models.user.findOne({ attributes: ["id"], where: { id: userToFollowId } });
        if (!userToFollow)
            return { status: false, error: 'Following user not found' };
    }

    if (companyId) {
        company = await models.company.findOne({ attributes: ["id"], where: { id: companyId } });
        if (!company)
            return { status: false, error: 'Company not found' };
    }

    if (jobId) {
        job = await models.job.findOne({ attributes: ["id"], where: { id: jobId } });
        if (!job)
            return { status: false, error: 'Job not found' };
    }

    if (teamId) {
        team = await models.team.findOne({ attributes: ["id"], where: { id: teamId } });
        if (!team)
            return { status: false, error: 'Team not found' };
    }

    let result = false;
    await models.sequelize.transaction(async t => {
        if (isFollowing) {
            if (userToFollow) await userToFollow.addFollower(user, { transaction: t });
            if (company) await company.addFollower(user, { transaction: t });
            if (job) await job.addFollower(user, { transaction: t });
            if (team) await team.addFollower(user, { transaction: t });
        } else {
            if (userToFollow) await userToFollow.removeFollower(user, { transaction: t });
            if (company) await company.removeFollower(user, { transaction: t });
            if (job) await job.removeFollower(user, { transaction: t });
            if (team) await team.removeFollower(user, { transaction: t });
        }
        result = true;
    });

    return { status: result };
}

const setPosition = async (position, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.user.setPosition, {
        position
    });

    const profile = await models.profile.findOne({
        where: {
            userId: user.id
        }
    });
    profile.position = position;

    const result = await profile.save();
    if (result !== profile) {
        console.log(result);
        throw new Error(JSON.stringify(result.errors));
    }

    return { status: true };
}

const createProfileResponse = async (user, models, languageId) => {
    const userQuery = models.user.findOne({ where: { id: user.id }});

    const userProfile = models.profile.findOne({
        where: {
            userId: user.id
        },
        include: [
            { association: 'salary' }
        ]
    });

    const promises = [userQuery, userProfile];
    promises.push.apply(includeForFind(languageId).map(item => models.user.findOne({
        where: {
            id: user.id
        },
        include: [
            item
        ],
        attributes: ['id']
    })));

    const newUserResults = await Promise.all(promises);

    let final = {};
    newUserResults.forEach(item => final = {
        ...final,
        ...item.get(),
    });

    return final;
}

const includeForFind = (languageId) => [
    { association: 'skills', include: [{ association: 'i18n' }] },
    { association: 'values', include: [{ association: 'i18n' }] },
    {
        association: 'ownedCompanies',
        ...companyAssociationForUserProfile(languageId)
    },
    //{ association: 'profile', include: [{ association: 'salary' }] },
    { association: 'articles' },
    { association: 'experience', include: [{ association: 'i18n' }, { association: 'videos' }, { association: 'images' }] },
    { association: 'projects', include: [{ association: 'i18n' }, { association: 'videos' }, { association: 'images' }] },
    { association: 'story', include: [{ association: 'i18n' }] },
    { association: 'contact' },
    {
        association: 'featuredArticles', include: [
            { association: 'author' },
            { association: 'i18n', where: { languageId } },
            { association: 'images' },
            { association: 'videos' },
            { association: 'featuredImage' }
        ]
    },
    {
        association: 'aboutMeArticles', include: [
            { association: 'author' },
            { association: 'i18n', where: { languageId } },
            { association: 'images' },
            { association: 'videos' },
            { association: 'featuredImage' }
        ]
    },
    { association: 'followers' },
    { association: 'followees' },
    {
        association: 'followingCompanies',
        include: [
            { association: 'i18n', where: { languageId } }
        ]
    }, 
    {
        association: 'followingJobs',
        include: [
            { association: 'i18n', where: { languageId } }
        ]
    },
    {
        association: 'followingTeams'
    },
    {
        association: 'appliedJobs',
        include: [
            { association: 'i18n', where: { languageId } }
        ]
    }
];

module.exports = {
    Query: {
        profile: (_, { id, language }, context) => profile(id, language, context),
        profiles: (_, { language }, context) => all(language, context),
        // profileFeaturedArticles: (_, __, context) => userResolvers.profileFeaturedArticles(context),
        // userSkills: (_, __, context) => userResolvers.userSkills(context),
        // userValues: (_, __, context) => userResolvers.userValues(context),
        // userExperience: (_, __, context) => userResolvers.userExperience(context),
        // userProjects: (_, __, context) => userResolvers.userProjects(context)
    },
    Mutation: {
        avatar: (_, { status, contentType, path }, context) => setAvatar(status, contentType, path, context),
        profileCover: (_, { status, contentType, path }, context) => setProfileCover(status, contentType, path, context),
        setCoverBackground: (_, { color }, context) => setCoverBackground(color, context),
        setSalary: (_, { salary }, context) => setSalary(salary, context),
        setStory: (_, { language, story }, context) => setStory(language, story, context),

        setValues: (_, { addValues, removeValues, language }, context) => setValues(addValues, removeValues, language, context),
        setSkills: (_, { addSkills, removeSkills, language }, context) => setSkills(addSkills, removeSkills, language, context),
        setContact: (_, { contact }, context) => setContact(contact, context),

        setProject: (_, { project, language }, context) => setProject(project, language, context),
        removeProject: (_, { id }, context) => removeProject(id, context),

        setExperience: (_, { experience, language }, context) => setExperience(experience, language, context),
        removeExperience: (_, { id }, context) => removeExperience(id, context),

        handleFollow: (_, { details }, context) => handleFollow(details, context),

        setPosition: (_, { position }, context) => setPosition(position, context),
    }
};