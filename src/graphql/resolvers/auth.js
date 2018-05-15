import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
//import nodemailer from 'nodemailer';
import validator from 'validator';
import uniqid from 'uniqid';
import { AuthenticationError } from './errors';

const createAccount = async (nickname, email, password, { models }) => {
    let response = {
        status: false,
        error: ''
    };
    nickname = nickname.trim();
    if (!nickname || nickname.trim().length < 1 || nickname.trim().length > 50) {
        response.error = 'Nickname should be between 1 and 50 characters';
        return response;
    }
    email = email.trim();
    if (email.length < 1 || email.length > 100) {
        response.error = 'Email should be between 1 and 30 characters';
        return response;
    } else if (!validator.isEmail(email)) {
        response.error = 'Invalid email address'
        return response;
    }
    if (password.length < 1 || password.length > 30) {
        response.error = 'Password should be between 1 and 30 characters';
        return response;
    }
    let user = await models.user.findOne({ where: { email: email } });
    if (user) {
        response.error = 'Someone might have beat you to it :)';
        return response;
    }
    user = await models.user.create({
        uid: uniqid(),
        nickname,
        email,
        salt: await bcrypt.hash("" + new Date().getTime(), 12),
        hash: await bcrypt.hash(password, 12),
        status: 'active'
    }, {});
    if (!user) {
        response.error = 'Sorry ... we could not create your account';
        return response;
    }
    response.status = true;
    response.error = '';
    return response;
};

const attemptLogin = async (email, password, { models }) => {
    let response = {
        token: null,
        refreshToken: null
    }
    email = email.trim();
    if (email.length > 100) {
        return {
            error: 'Email address is longer than 100 characters'
        };
    } else if (!validator.isEmail(email)) {
        return {
            error: 'Invalid email address'
        };
    }
    if (password.length > 30) {
        return {
            error: 'Password is longer than 30 characters'
        };
    }
    const user = await models.user.findOne({ where: {email: email, status: 'active'} });
    if (!user) {
        return {
            error: 'Invalid credentials'
        };
    }
    const valid = await bcrypt.compare(password, user.hash);
    if (!valid) {
        return {
            error: 'Invalid credentials'
        };
    }
    return _createTokens(user);
}

const checkTokens = async (token, refreshToken, { models }) => {
    let decodedToken;
    let decodedRefreshToken;
    let user;
    let response = {
        status: false,
        token: null,
        refreshToken: null,
        error: null
    }
    try {
        decodedToken = await jwt.decode(token);
        decodedRefreshToken = await jwt.decode(refreshToken);
        decodedToken.data = JSON.parse(_decrypt(decodedToken.data));
        decodedRefreshToken.data = JSON.parse(_decrypt(decodedRefreshToken.data));
        user = await models.user.findOne({ where: {id: decodedToken.data.id} });
        decodedToken = await jwt.verify(token, user.salt + process.env.JWT_SECRET);
        decodedRefreshToken = await jwt.verify(refreshToken, user.salt + process.env.JWT_REFRESH_SECRET);
    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            // const { token, refreshToken } = _createTokens(user);
            // response.token = token;
            // response.refreshToken = refreshToken;
            response.status = false;
            return response;
        } else {
            response.error = err;
            return response;
        }
    }
    response.status = true;

    return response;
}

const forgotPasswordSendCode = async (email, { models }) => {
    let status = false;
    let user = null;
    let error = [];
    let emailHandle = null;
    email = email.trim();
    if (email.length > 100) {
        return {
            error: 'Email is longer than 100 characters'
        };
    } else if (!validator.isEmail(email)) {
        return {
            error: 'Email is invalid'
        };
    }
    try {
        user = await models.user.findOne({ where: {email: email} });
    } catch(err) {
        return {
            error: 'Invalid credentials'
        };
    }
    if (user) {
        user.passwordResetToken = uuidv4();
        if (await user.save()) {
            emailHandle = await _sendEmail(process.env.smtp_from, email, "Recover Password", "Text: " + user.passwordResetToken, user.passwordResetToken);
            if (emailHandle.err) {
                return {
                    error: 'Email could not be sent :('
                };
            } else {
                status = true;
            }
        }
    }
    return {
        status,
        error
    }
}

const forgotPasswordUpdate = async (token, password, { models }) => {
    let status = false;
    let user = null;
    let error = [];
    if (password.length > 30) {
        return {
            error: 'Password is longer than 30 characters'
        };
    }
    try {
        user = await models.user.findOne({ where: {passwordResetToken: token} });
    } catch(err) {
        return {
            error: 'Invalid credentials'
        };
    }
    if (user) {
        user.passwordResetToken = null;
        user.salt = await bcrypt.hash("" + new Date().getTime(), 12);
        user.hash = await bcrypt.hash(password, 12);
        if (await user.save()) {
            status = true;
        }
    } else {
        return {
            error: 'Invalid credentials'
        };
    }
    return {
        status,
        error
    }
}

const forgotPasswordCheckToken = async (token, { models }) => {
    let status = false;
    let user = null;
    let error = [];
    try {
        user = await models.user.findOne({ where: {passwordResetToken: token} });
    } catch(err) {
        return {
            error: 'Invalid credentials'
        };
    }
    if (user) {
        status = true;
    } else {
        return {
            error: 'Invalid credentials'
        };
    }
    return {
        status,
        error
    }
}

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
    const refreshToken = jwt.sign(
        {
            data: _encrypt(JSON.stringify({
                id: user.id
            }))
        },
        user.salt + process.env.JWT_REFRESH_SECRET,
        {
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

/*const _sendEmail = async (from, to, subject, text, html) => {
    const smtpConfig = {
        host: process.env.smtp_host,
        port: process.env.smtp_port,
        secure: true,
        auth: {
            user: process.env.smtp_username,
            pass: process.env.smtp_password
        }
    };
    let transporter = nodemailer.createTransport(smtpConfig);
    return await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html,
    });
}*/

export default { createAccount, attemptLogin, checkTokens, forgotPasswordSendCode, forgotPasswordUpdate, forgotPasswordCheckToken };
