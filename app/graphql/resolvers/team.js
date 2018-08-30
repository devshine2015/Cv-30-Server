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

const handleTeamMember = async (teamId, memberId, add, { user, models }) => {
    checkUserAuth(user);
    yupValidation(schema.team.handleTeamMember, { teamId, memberId, add });

    const team = await models.team.findOne({ attributes: ["id", "companyId"], where: { id: teamId } });
    if (!team)
        return { status: false, error: 'Team not found' };

    const companyOk = await validateCompany(team.companyId, user, models);
    if (companyOk !== true) return companyOk;

    const member = await models.user.findOne({ attributes: ["id"], where: { id: memberId } });
    if (!member)
        return { status: false, error: 'Member not found' };

    if (add) {
        await team.addMember(member);
    } else {
        await team.removeMember(member);
    }

    return { status: true };
}

const team = async (id, language, { models }) => {
    yupValidation(schema.team.one, { id, language });

    const languageId = await getLanguageIdByCode(models, language);
    const promises = profileSubQueriesParams(languageId).map(item => {
        let query = models.team.findOne({
            where: { id },
            include: [
                item.include
            ],
            attributes: item.allAttributes ? undefined : ['id']
        });
        if (item.then) {
            query = query.then(item.then);
        } else {
            query = query.then(team => team.get({plain: true}));
        }
        return query;
    });

    const teamResults = await Promise.all(promises);

    return teamResults.reduce((acc, teamPart) => ({
        ...acc,
        ...teamPart
    }), {});
}

const all = async (language, { models }) => {
    yupValidation(schema.team.all, { language });

    const languageId = await getLanguageIdByCode(models, language);
    const promises = profileSubQueriesParams(languageId).map(item => {
        let query = models.team.findAll({
            include: [
                item.include
            ],
            attributes: item.allAttributes ? undefined : ['id']
        });
        if (item.then) {
            query = query.then(teams => teams.map(item.then));
        } else {
            query = query.then(teams => teams.map(team => team.get({plain: true})));
        }
        return query;
    });

    const teamsResults = await Promise.all(promises);

    return teamsResults.reduce((acc, teamsResult) => teamsResult.map((teamPart, i) => ({
        ...acc[i],
        ...teamPart
    })), []);
}

const profileSubQueriesParams = (languageId) => [
    {
        include: {
            association: 'officeArticles',
            include: [
                { association: 'featuredImage', include: [{ association: 'i18n' }] },
                { association: 'images', include: [{ association: 'i18n' }] },
                { association: 'i18n', where: { languageId } }
            ]
        }
    },
    {
        include: {
            association: 'company',
            include: [
                { association: 'i18n', where: { languageId } },
                { association: 'owner' }
            ]
        },
        allAttributes: true
    },
    {
        include: {
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
        then: team => ({
            ...team.get({ plain: true }),
            members: team.members ? team.members.map(member => ({ 
                ...member.get({plain: true}),
                ...member.profile ? member.profile.get({plain: true}) : {}
            })) : []
        })
    },
    {
        include: { association: 'shallowMembers' }
    },
    {
        include: {
            association: 'jobs',
            include: [
                { association: 'i18n', where: { languageId } }
            ]
        }
    }
];

module.exports = {
    Query: {
        teams: (_, { language }, context) => all(language, context),
        team: (_, { id, language }, context) => team(id, language, context)
    },
    Mutation: {
        handleTeam: (_, { teamDetails }, context) => handleTeam(teamDetails, context),
        handleTeamMember: (_, { teamId, memberId, add }, context) => handleTeamMember(teamId, memberId, add, context),
    }
}