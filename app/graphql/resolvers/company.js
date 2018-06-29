const uuid = require('uuidv4');
const schema = require('../validation');

const handleTeam = async (team, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

    return response;
}

const handleQA = async (qa, { user, models }) => {
    validateUser(user);

    let response = {
        status: false,
        error: ''
    };

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

module.exports = {
    handleQA,
    handleTeam
}