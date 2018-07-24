const checkUserAuth = (user) => {
    if (!user)
        throwForbiddenError();
}

const throwForbiddenError = () => {
    const errors = [ forbiddenError() ];
    console.log(errors);
    throw new Error(errors);
}

const forbiddenError = () => {
    return {
        name: 'Forbidden',
        message: 'Not allowed',
        statusCode: 403
    }
}

const yupValidation = (yupValidator, input) => {
    try {
        yupValidator.validateSync(input, { abortEarly: false });
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
}

const getLanguageByCode = async (models, code, attributes = ["id"]) => {
    return models.language.findOne({
        attributes,
        where: {
            code
        }
    });
}

const getLanguageIdByCode = async (models, code, attributes = ["id"]) => {
    return (await models.language.findOne({
        attributes,
        where: {
            code
        }
    })).id;
}

const validateCompany = async (id, user, models) => {
    const company = await models.company.findOne({ attributes: ["id", "ownerId"], where: { id } });

    if (!company) return { status: false, error: 'Company not found' };
    if (company.ownerId != user.id) throwForbiddenError();
    
    return true;
}

module.exports = {
    checkUserAuth,
    yupValidation,
    forbiddenError,
    throwForbiddenError,
    getLanguageByCode,
    getLanguageIdByCode,
    validateCompany
}