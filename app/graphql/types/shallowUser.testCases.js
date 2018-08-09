const { isEqual, isMatch } = require('lodash');

const handleShallowUserTestCaseAddValid = {
    id: 'handleShallowUser Test Case add valid',
    query: `
      mutation($shallowUser: ShallowUserInput!) {
        handleShallowUser(shallowUser: $shallowUser) {
            status
            error
        }
      }
    `,
    variables: { 
        shallowUser: {
            id: "id",
            email: "email",
            firstName: "firstName",
            lastName: "lastName",
            position: "position"
        }
    },
    context: {},
    expected: result => isEqual(result, { data: { handleShallowUser: { status: true, error: null } } })
};

const handleShallowUserTestCaseAddValidMissingId = {
    id: 'handleShallowUser Test Case add valid missing id',
    query: `
      mutation($shallowUser: ShallowUserInput!) {
        handleShallowUser(shallowUser: $shallowUser) {
            status
            error
        }
      }
    `,
    variables: { 
        shallowUser: {
            email: "email",
            firstName: "firstName",
            lastName: "lastName",
            position: "position"
        }
    },
    context: {},
    expected: result => isEqual(result, { data: { handleShallowUser: { status: true, error: null } } })
};

const handleShallowUserTestCaseOptionsValid = {
    id: 'handleShallowUser options only valid data',
    query: `
      mutation($options: ShallowUserOptions!) {
        handleShallowUser(options: $options) {
            status
            error
        }
      }
    `,
    variables: {
        options: {
            shallowUserId: "shallowUser",
            teamId: "teamId",
            isMember: true
        }
    },
    context: {},
    expected: result => isEqual(result, { data: { handleShallowUser: { status: true, error: null } } })
};

const handleShallowUserTestCaseOptionsValidMissingIsMember = {
    id: 'handleShallowUser options only valid data missing isMember',
    query: `
      mutation($options: ShallowUserOptions!) {
        handleShallowUser(options: $options) {
            status
            error
        }
      }
    `,
    variables: {
        options: {
            shallowUserId: "shallowUser",
            teamId: "teamId",
        }
    },
    context: {},
    expected: result => isEqual(result, { data: { handleShallowUser: { status: true, error: null } } })
};

const handleShallowUserTestCaseOptionsInvalidMissingShallowUserId = {
    id: 'handleShallowUser options only missing shallowUserId',
    query: `
      mutation($options: ShallowUserOptions!) {
        handleShallowUser(options: $options) {
            status
            error
        }
      }
    `,
    variables: {
        options: {
            teamId: "teamId",
            isMember: true
        }
    },
    context: {},
    expected: result => isMatch(result, { errors: [] })
};

const handleShallowUserTestCaseOptionsInvalidMissingTeamId = {
    id: 'handleShallowUser options only missing shallowUserId',
    query: `
      mutation($options: ShallowUserOptions!) {
        handleShallowUser(options: $options) {
            status
            error
        }
      }
    `,
    variables: {
        options: {
            shallowUserId: "shallowUserId",
            isMember: true
        }
    },
    context: {},
    expected: result => isMatch(result, { errors: [] })
};

module.exports = [
    handleShallowUserTestCaseAddValid,
    handleShallowUserTestCaseAddValidMissingId,
    handleShallowUserTestCaseOptionsValid,
    handleShallowUserTestCaseOptionsValidMissingIsMember,
    handleShallowUserTestCaseOptionsInvalidMissingShallowUserId,
    handleShallowUserTestCaseOptionsInvalidMissingTeamId
]