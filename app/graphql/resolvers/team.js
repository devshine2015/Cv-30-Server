const uuid = require('uuidv4');
const schema = require('../validation');
const { validateUser, yupValidation } = require('./user');

const handleTeam = async (teamDetails, { user, models }) => {
    validateUser(user);
    yupValidation(schema.team.input, { teamDetails });

    teamDetails.id = teamDetails.id || uuid();
    teamDetails.coverBackground = teamDetails.profileBackgroundColor;
    await models.team.upsert(teamDetails);

    return { status: true };
}

const addMemberToTeam = async (teamId, memberId, { user, models }) => {
    validateUser(user);
    yupValidation(schema.team.addRemoveMemberInput, { teamId, memberId });

    const team = await models.team.findOne({ where: { id: teamId } });
    const member = await models.user.findOne({ where: { id: memberId } });
    team.addMember(member);

    return { status: true };
}

const removeMemberFromTeam = async (teamId, memberId, { user, models }) => {
    validateUser(user);
    yupValidation(schema.team.addRemoveMemberInput, { teamId, memberId });

    const team = await models.team.findOne({ where: { id: teamId } });
    const member = await models.user.findOne({ where: { id: memberId } });
    team.removeMember(member);

    return { status: true };
}

module.exports = {
    handleTeam,
    addMemberToTeam,
    removeMemberFromTeam
}