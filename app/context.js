const jwt = require('jsonwebtoken');
const models = require('./models/');
const crypto = require('crypto');
// const cleanHeaderName = require('./utils').cleanHeaderName;

module.exports = async (req, res) => {
    const { headers, cookies } = req;
    let authorization = null;
    let refreshToken = null;
    let user = null;
    let bearerLength = 0;
    const tokenHeader = process.env.TOKEN_HEADER;
    const refreshTokenHeader = process.env.REFRESH_TOKEN_HEADER;
    if (cookies && cookies[tokenHeader]) authorization = cookies[tokenHeader];
    if (cookies && cookies[refreshTokenHeader]) refreshToken = cookies[refreshTokenHeader];
    if (!authorization && headers[tokenHeader]) {
        authorization = headers[tokenHeader];
        bearerLength = "Bearer ".length;
    }
    if (!refreshToken && headers[refreshTokenHeader]) refreshToken = headers[refreshTokenHeader];
    if (authorization && authorization.length > bearerLength) {
        const token = authorization.slice(bearerLength);
        const decodedToken = await jwt.decode(token);
        if (decodedToken) {
            decodedToken.data = JSON.parse(_decrypt(decodedToken.data));
            if (decodedToken.data && decodedToken.data.id) {
                user = await models.user.findOne({
                    where: { id: decodedToken.data.id, status: 'active' }
                });
            }
        }
        if (user) {
            const { ok, result } = await new Promise(function (resolve) {
                jwt.verify(token, user.salt + process.env.JWT_SECRET, function (err, result) {
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
                if (result.name == 'TokenExpiredError') {
                    const { ok, result } = await new Promise(function (resolve) {
                        jwt.verify(refreshToken, user.salt + process.env.JWT_REFRESH_SECRET, function (err, result) {
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
                        let tokens = _createTokens(user);
                        if (res) {
                            res.cookie(tokenHeader, tokens.token, {
                                path: '/',
                                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                                secure: process.env.NODE_ENV === 'production',
                                httpOnly: true
                            });
                            res.cookie(refreshTokenHeader, tokens.refreshToken, {
                                path: '/',
                                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                                secure: process.env.NODE_ENV === 'production',
                                httpOnly: true
                            });
                        }
                        tokens.id = user.id;
                        tokens.email = user.email;
                        tokens.firstName = user.firstName;
                        tokens.lastName = user.lastName;
                        tokens.hasAvatar = !!(user.profile && user.profile.hasAvatar)
                        return {
                            tokens,
                            user,
                            models
                        };
                    } else {
                        console.log(result);
                        if (res) {
                            res.clearCookie(tokenHeader);
                            res.clearCookie(refreshTokenHeader);
                        }
                        return {
                            user: null,
                            models
                        };
                    }
                } else {
                    console.log(result);
                    if (res) {
                        res.clearCookie(tokenHeader);
                        res.clearCookie(refreshTokenHeader);
                    }
                    return {
                        user: null,
                        models
                    };
                }
            }
        }
    }
    return {
        user: null,
        models
    };
};

const _createTokens = (user) => {
    const token = jwt.sign(
        {
            data: _encrypt(JSON.stringify({
                id: user.id
            }))
        },
        user.salt + process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME
        }
    );
    const refreshToken = jwt.sign({
        data: _encrypt(JSON.stringify({
            id: user.id
        }))
    },
        user.salt + process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_LIFETIME
        }
    );
    return {
        token: token,
        refreshToken: refreshToken
    };
}

const _encrypt = (text) => {
    const cipher = crypto.createCipher(process.env.JWT_CRYPTO_ALGORITHM, process.env.JWT_CRYPTO_PASSWORD);
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

const _decrypt = (text) => {
    const decipher = crypto.createDecipher(process.env.JWT_CRYPTO_ALGORITHM, process.env.JWT_CRYPTO_PASSWORD)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}