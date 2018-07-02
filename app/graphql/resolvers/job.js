const uuid = require('uuidv4');
const schema = require('../validation');
const { validateUser } = require('./user');

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

    if (jobDetails) {
        await models.sequelize.transaction(async t => {
        
            jobDetails.id = jobDetails.id || uuid();
            await models.job.upsert(jobDetails, {transaction: t});
            jobDetails.jobId = jobDetails.id;
            jobDetails.languageId = language.id;
            await models.jobText.upsert(jobDetails, {transaction: t});
        });
    }

    return { status: true };
}

module.exports = {
    handleJob
}