/*

decodedToken = await jwt.decode(token);
decodedRefreshToken = await jwt.decode(refreshToken);
decodedToken.data = JSON.parse(_decrypt(decodedToken.data));
decodedRefreshToken.data = JSON.parse(_decrypt(decodedRefreshToken.data));
user = await models.user.findOne({ where: {id: decodedToken.data.id} });
decodedToken = await jwt.verify(token, user.salt + process.env.JWT_SECRET);
decodedRefreshToken = await jwt.verify(refreshToken, user.salt + process.env.JWT_REFRESH_SECRET);

*/
import jwt from 'jsonwebtoken';
import models from './models/';
import crypto from 'crypto';

const CV30_TOKEN_HEADER            = 'swt-token';
const CV30_REFRESH_TOKEN_HEADER    = 'swt-refresh-token';

export default async ({headers}) => {
    let authorization = null;
    let refreshToken = null;
    if (headers[CV30_TOKEN_HEADER]) authorization = headers[CV30_TOKEN_HEADER];
    if (headers[CV30_REFRESH_TOKEN_HEADER]) refreshToken = headers[CV30_REFRESH_TOKEN_HEADER];
    if (authorization) {
        const bearerLength = "Bearer ".length;
        if (authorization && authorization.length > bearerLength) {
            const token = authorization.slice(bearerLength);
            const decodedToken = await jwt.decode(token);
            decodedToken.data = JSON.parse(_decrypt(decodedToken.data));
            const user = await models.user.findOne({ where: {id: decodedToken.data.id} });
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
                    console.error(result);
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

const _decrypt = (text) => {
    const decipher = crypto.createDecipher(process.env.JWT_CRYPTO_ALGORITHM, process.env.JWT_CRYPTO_PASSWORD)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}