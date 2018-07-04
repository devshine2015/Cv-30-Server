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

module.exports = {
    checkUserAuth,
    yupValidation,
    forbiddenError,
    throwForbiddenError
}