const uuid = require('uuidv4');
const schema = require('../validation');

const handleJob = async(language, jobDetails, { user, models }) => {
    validateUser(user);

    try {
        schema.job.input.validateSync({
            language,
            jobDetails
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
        if (jobDetails) {
            jobDetails.id = jobDetails.id || uuid();
            await models.job.upsert(jobDetails, {transaction: t});
            jobDetails.jobId = jobDetails.id;
            jobDetails.languageId = language.id;
            await models.jobText.upsert(jobDetails, {transaction: t});
        }
    });

    return { status: true };
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
    handleJob
}