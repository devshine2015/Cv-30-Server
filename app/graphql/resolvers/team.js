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

module.exports = {
    handleTeam,
    addMemberToTeam,
    removeMemberFromTeam
}