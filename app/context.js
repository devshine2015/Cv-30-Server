/*

decodedToken = await jwt.decode(token);
decodedRefreshToken = await jwt.decode(refreshToken);
decodedToken.data = JSON.parse(_decrypt(decodedToken.data));
decodedRefreshToken.data = JSON.parse(_decrypt(decodedRefreshToken.data));
user = await models.user.findOne({ where: {id: decodedToken.data.id} });
decodedToken = await jwt.verify(token, user.salt + process.env.JWT_SECRET);
decodedRefreshToken = await jwt.verify(refreshToken, user.salt + process.env.JWT_REFRESH_SECRET);

*/
const jwt = require('jsonwebtoken');
const models = require('./models/');
const crypto = require('crypto');

module.exports = async ({headers, cookies}) => {
    let authorization = null;
    let refreshToken = null;
    let user = null;
    let bearerLength = 0;
    if (cookies[process.env.TOKEN_NAME]) authorization = cookies[process.env.TOKEN_NAME];
    if (cookies[process.env.REFRESH_TOKEN_NAME]) refreshToken = cookies[process.env.REFRESH_TOKEN_NAME];
    if (!authorization && headers[process.env.TOKEN_NAME]) {
        authorization = headers[process.env.TOKEN_NAME];
        bearerLength = "Bearer ".length;
    }
    if (!refreshToken && headers[process.env.REFRESH_TOKEN_NAME]) refreshToken = headers[process.env.REFRESH_TOKEN_NAME];
    if (authorization && authorization.length > bearerLength) {
        const token = authorization.slice(bearerLength);
        const decodedToken = await jwt.decode(token);
        if (decodedToken) {
            decodedToken.data = JSON.parse(_decrypt(decodedToken.data));
            user = await models.user.findOne({ where: {id: decodedToken.data.id} });
        }
        if (user) {
            const { ok, result } = await new Promise(function(resolve) {
                jwt.verify(token, user.salt + process.env.JWT_SECRET, function(err, result) {
                    if (err) {
                        resolve({
                            ok: false,
                            result: err
                        });
                    } else {
                        resolve({
                            ok: true,
                            result
                        });
                    }
                });
            });
            if (ok) {
                return {
                    user,
                    models
                };
            } else {
                return {
                    user: null,
                    models
                };
            }
        }
    }
    return {
        user: null,
        models
    };
};

const _decrypt = (text) => {
    const decipher = crypto.createDecipher(process.env.JWT_CRYPTO_ALGORITHM, process.env.JWT_CRYPTO_PASSWORD)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}