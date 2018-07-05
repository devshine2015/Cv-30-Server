const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, throwForbiddenError } = require('./common');

const handleTeam = async (teamDetails, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.input, { teamDetails });

    const company = await models.company.findOne({ where: { id: teamDetails.companyId } });
    if (!company)
        return { status: false, error: 'Company not found' };
    
    if (company.userId != user.id)
        throwForbiddenError();

    if (teamDetails.id && !await models.team.findOne({ where: { id: teamDetails.id } }))
        return { status: false, error: 'Team not found' }

    teamDetails.id = teamDetails.id || uuid();
    teamDetails.coverBackground = teamDetails.profileBackgroundColor;
    await models.team.upsert(teamDetails);

    return { status: true };
}

const addMemberToTeam = async (teamId, memberId, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.addRemoveMemberInput, { teamId, memberId });

    const team = await models.team.findOne({ where: { id: teamId } });
    if (!team)
        return { status: false, error: 'Team not found' };

    const company = await models.company.findOne({ where: { id: team.companyId } });
    if (!company || company.userId != user.id)
        throwForbiddenError();

    const member = await models.user.findOne({ where: { id: memberId } });
    if (!member)
        return { status: false, error: 'Member not found' };

    team.addMember(member);

    return { status: true };
}

const removeMemberFromTeam = async (teamId, memberId, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.addRemoveMemberInput, { teamId, memberId });

    const team = await models.team.findOne({ where: { id: teamId } });
    if (!team)
        return { status: false, error: 'Team not found' };

    const company = await models.company.findOne({ where: { id: team.companyId } });
    if (!company || company.userId != user.id)
        throwForbiddenError();

    const member = await models.user.findOne({ where: { id: memberId } });
    if (!member)
        return { status: false, error: 'Member not found' };

    team.removeMember(member);

    return { status: true };
}

const team = async (id, language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.one, { id, language });
    language = await models.language.findOne({
        where: {
            code: language
        }
    });
    return models.team.findOne({
        where: { id },
        ...includeForFind(language.id)
    });
}

const all = async (language, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.all, { language });
    language = await models.language.findOne({
        where: {
            code: language
        }
    });
    return models.team.findAll({
        where: {},
        ...includeForFind(language.id)
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