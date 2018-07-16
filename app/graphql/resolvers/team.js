const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, throwForbiddenError, getLanguageIdByCode } = require('./common');

const handleTeam = async (teamDetails, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.input, { teamDetails });

    const company = await models.company.findOne({ attributes: ["id", "userId"], where: { id: teamDetails.companyId } });
    if (!company)
        return { status: false, error: 'Company not found' };
    
    if (company.userId != user.id)
        throwForbiddenError();

    teamDetails.id = teamDetails.id || uuid();
    await models.team.upsert(teamDetails);

    return { status: true };
}

const addMemberToTeam = async (teamId, memberId, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.addRemoveMemberInput, { teamId, memberId });

    const team = await models.team.findOne({ attributes: ["id", "companyId"], where: { id: teamId } });
    if (!team)
        return { status: false, error: 'Team not found' };

    const company = await models.company.findOne({ attributes: ["id", "userId"], where: { id: team.companyId } });
    if (!company || company.userId != user.id)
        throwForbiddenError();

    const member = await models.user.findOne({ attributes: ["id"], where: { id: memberId } });
    if (!member)
        return { status: false, error: 'Member not found' };

    await team.addMember(member);

    return { status: true };
}

const removeMemberFromTeam = async (teamId, memberId, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.addRemoveMemberInput, { teamId, memberId });

    const team = await models.team.findOne({ attributes: ["id", "companyId"], where: { id: teamId } });
    if (!team)
        return { status: false, error: 'Team not found' };

    const company = await models.company.findOne({ attributes: ["id", "userId"], where: { id: team.companyId } });
    if (!company || company.userId != user.id)
        throwForbiddenError();

    const member = await models.user.findOne({ attributes: ["id"], where: { id: memberId } });
    if (!member)
        return { status: false, error: 'Member not found' };

    team.removeMember(member);

    return { status: true };
}

const team = async (id, language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.one, { id, language });
    return models.team.findOne({
        where: { id },
        ...includeForFind(await getLanguageIdByCode(models, language))
    });
}

const all = async (language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.all, { language });
    return models.team.findAll({
        where: {},
        ...includeForFind(await getLanguageIdByCode(models, language))
    });
}

const includeForFind = (languageId) => {
    return {
        include: [
            {
                association: 'officeArticles',
                include: [
                    { association: 'featuredImage', include: [{ association: 'i18n' }] },
                    { association: 'images', include: [{ association: 'i18n' }] },
                    { association: 'i18n', where: { languageId } }
                ]
            },
            {
                association: 'company',
                include: [
                    { association: 'i18n', where: { languageId } }
                ]
            },
            {
                association: 'members',
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
            },
            {
                association: 'jobs',
                include: [
                    { association: 'i18n', where: { languageId } }
                ]
            }
        ]
    };
}

module.exports = {
    handleTeam,
    addMemberToTeam,
    removeMemberFromTeam,
    team,
    all
}