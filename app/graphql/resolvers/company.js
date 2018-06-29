const uuid = require('uuidv4');
const schema = require('../validation');

const handleCompany = async(language, details, { user, models }) => {
    validateUser(user);

    try {
        schema.company.input.validateSync({
            language,
            details
        }, { abortEarly: false });
    } catch (error) {
        console.log(error);
        throw new Error(
            JSON.stringify(
                error.inner.map(err => ({
                    path: err.path,
                    type: err.type,
                    message: err.message
                }))
            )
        );
    }
    
    language = await models.language.findOne({
        where: {
            code: language
        }
    });

    await models.sequelize.transaction(async t => {
        if (details) {
            details.id = details.id || uuid();
            await models.company.upsert(details);
            details.companyId = details.id;
            details.languageId = language.id;
            await models.companyText.upsert(details);
        }
    });

    return { status: true };
}

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
    handleCompany,
    handleQA,
    handleTeam
}