const uuid = require('uuidv4');
const schema = require('../validation');
const { checkUserAuth, yupValidation, getLanguageIdByCode, validateCompany } = require('./common');

const handleTeam = async (teamDetails, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.input, { teamDetails });

    const companyOk = await validateCompany(teamDetails.companyId, user, models);
    if (companyOk !== true) return companyOk;

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

    const companyOk = await validateCompany(team.companyId, user, models);
    if (companyOk !== true) return companyOk;

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

    const companyOk = await validateCompany(team.companyId, user, models);
    if (companyOk !== true) return companyOk;

    const member = await models.user.findOne({ attributes: ["id"], where: { id: memberId } });
    if (!member)
        return { status: false, error: 'Member not found' };

    team.removeMember(member);

    return { status: true };
}

const team = async (id, language, { models }) => {
    yupValidation(schema.team.one, { id, language });
    return models.team.findOne({
        where: { id },
        ...includeForFind(await getLanguageIdByCode(models, language))
    });
}

// TRY THIS IF THE STANDARD ONE TAKES TOO LONG
// const team = async (id, language, { models }) => {
//     yupValidation(schema.team.one, { id, language });

//     const languageId = await getLanguageIdByCode(models, language);
//     const teamQuery = models.team.findOne({where: { id }});
//     const promises = [teamQuery];
//     promises.push.apply(promises, includeAssosiactions(languageId).map(include => models.team.findOne({
//         where: { id },
//         include,
//         attributes: ['id']
//     })));

//     const teamResults = await Promise.all(promises);

//     return teamResults.reduce((acc, team) => ({
//         ...acc,
//         ...team.get()
//     }), {});
// }

const all = async (language, { models }) => {
    yupValidation(schema.team.all, { language });

    const languageId = await getLanguageIdByCode(models, language);
    const teamsQuery = models.team.findAll();
    const promises = [teamsQuery];
    promises.push.apply(promises, includeAssosiactions(languageId).map(include => models.team.findAll({
        include,
        attributes: ['id']
    })));

    const teamsResults = await Promise.all(promises);

    return teamsResults.reduce((acc, teamsResult) => teamsResult.map((k,i) => ({
        ...acc[i],
        ...k.get()
    })), []);
}

const includeAssosiactions = (languageId) => [
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
            { association: 'i18n', where: { languageId } },
            { association: 'owner' }
        ]
    },
    {
        association: 'members',
        include: [
            // { association: 'skills', include: [{ association: 'i18n' }] },
            // { association: 'values', include: [{ association: 'i18n' }] },
            { association: 'profile', include: [{ association: 'salary' }] },
            // { association: 'articles' },
            // { association: 'experience', include: [{ association: 'i18n' }] },
            // { association: 'projects', include: [{ association: 'i18n' }] },
            // { association: 'contact' },
            // { association: 'featuredArticles' }
        ]
    },
    {
        association: 'shallowMembers'
    },
    {
        association: 'jobs',
        include: [
            { association: 'i18n', where: { languageId } }
        ]
    }
];

const includeForFind = (languageId) => {
    return {
        include: includeAssosiactions(languageId)
    };
}

module.exports = {
    Query: {
        teams: (_, { language }, context) => all(language, context),
        team: (_, { id, language }, context) => team(id, language, context)
    },
    Mutation: {
        handleTeam: (_, { teamDetails }, context) => handleTeam(teamDetails, context),
        addMemberToTeam: (_, { teamId, memberId }, context) => addMemberToTeam(teamId, memberId, context),
        removeMemberFromTeam: (_, { teamId, memberId }, context) => removeMemberFromTeam(teamId, memberId, context),
    }
}