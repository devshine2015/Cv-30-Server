import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import validator from 'validator';
import uniqid from 'uniqid';

const list = (args, {user, models}) => {
    if (!user) return [];
    args.user_id = user.id;
    return models.card.findAll({
        where: args,
        include: [
            { model: models.user, as: 'user' },
            { model: models.cardContact, as: 'contacts' },
            { model: models.cardSocial, as: 'social' },
            { model: models.cardImage, as: 'images' },
            { model: models.cardText, as: 'texts' },
            { model: models.cardSetting, as: 'settings' }
        ]
    });
}

const store = async (details, { user, models }) => {
    let error = { id: 0 };
    let card = null;
    let counter = 0;
    if (!user) {
        return error;
    }
    if (!parseInt(details.id)) {
        try {
            card = await models.card.create({
                user_id: user.id
            });
            /*,{
                include: models.card.cardSetting
            }*/
        } catch(err) {
            return error;
        }
    } else {
        card = await models.card.findOne({
            where: {
                id: details.id,
                user_id: user.id
            },
            include: [ { all: true } ]
        });
        if (!card) return error;
    }
    if (details.contacts) {
        counter = card.cardContacts ? card.cardContacts.length : 0;
        let contacts = [];
        for (let i in details.contacts) {
            if (['phone', 'email'].indexOf(details.contacts[i].type) == -1) continue;
            // if (("" + details.contacts[i].id).indexOf('temp') != -1) delete details.contacts[i].id;
            if (details.contacts[i].content.length > 255) continue;
            details.contacts[i].card_id = card.id;
            if (!details.contacts[i].order) {
                details.contacts[i].order = counter;
                counter++;
            }
            contacts.push(details.contacts[i]);
        }
        card.contacts = await models.cardContact.bulkCreate(contacts, { ignoreDuplicates: true, updateOnDuplicate: true });
    }
    if (details.images) {
        counter = card.cardImages ? card.cardImages.length : 0;
        let images = [];
        for (let i in details.images) {
            if (['jpeg', 'png'].indexOf(details.images[i].type) == -1) continue;
            if (details.images[i].name.length > 255) continue;
            details.images[i].card_id = card.id;
            if (!details.images[i].order) {
                details.images[i].order = counter;
                counter++;
            }
            images.push(details.images[i]);
        }
        card.images = await models.cardImage.bulkCreate(images, { ignoreDuplicates: true, updateOnDuplicate: true });
    }
    if (details.social) {
        counter = card.cardSocials ? card.cardSocials.length : 0;
        let social = [];
        for (let i in details.social) {
            if (['url', 'facebook', 'twitter', 'instagram'].indexOf(details.social[i].type) == -1) continue;
            if (details.social[i].content.length > 255) continue;
            details.social[i].card_id = card.id;
            if (!details.social[i].order) {
                details.social[i].order = counter;
                counter++;
            }
            social.push(details.social[i]);
        }
        card.social = await models.cardSocial.bulkCreate(social, { ignoreDuplicates: true, updateOnDuplicate: true });
    }
    if (details.texts) {
        counter = card.cardTexts ? card.cardTexts.length : 0;
        let texts = [];
        for (let i in details.texts) {
            if (['front', 'back'].indexOf(details.texts[i].type) == -1) continue;
            if (details.texts[i].language) if (['en'].indexOf(details.texts[i].language) == -1) continue;
            details.texts[i].card_id = card.id;
            if (!details.texts[i].order) {
                details.texts[i].order = counter;
                counter++;
            }
            texts.push(details.texts[i]);
        }
        card.texts = await models.cardText.bulkCreate(texts, { ignoreDuplicates: true, updateOnDuplicate: true });
    }
    if (details.settings) {
        let settings = {
            card_id: card.id
        };
        if (typeof details.settings.visible != "undefined") settings.visible = !!details.settings.visible;
        if (typeof details.settings.shareable != "undefined") settings.shareable = !!details.settings.shareable;
        await models.cardSetting.upsert(settings);
        card.settings = await models.cardSetting.findOne({ where: { card_id: card.id } });
    }
    if (details.stats) {}
    return card;
}

/*const getUser = async () => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYTkzYzMwNGNkYjliZTlmNCIsImlhdCI6MTUyNDQ1NzQ2OCwiZXhwIjoxNTI0NDYxMDY4fQ.axrRl3l1NUem9v5rGRXnNMqZMAc5KkUWxobY3vitTd4";
    let refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYTkzYzMwNGNkYjliZTlmNCIsImlhdCI6MTUyNDQ1NzQ2OCwiZXhwIjoxNTI1MDYyMjY4fQ.cLsfewYNkCA2Y2o08LQkEx5zzqYbDDlullpqZH8jzmU";
    let decodedToken;
    let decodedRefreshToken;
    let user;
    let response = {
        user: null,
        error: []
    };
    try {
        decodedToken = await jwt.decode(token);
        decodedRefreshToken = await jwt.decode(refreshToken);
        decodedToken.data = JSON.parse(_decrypt(decodedToken.data));
        decodedRefreshToken.data = JSON.parse(_decrypt(decodedRefreshToken.data));
        user = await models.user.findOne({ where: {id: decodedToken.data.id} });
        decodedToken = await jwt.verify(token, user.salt + process.env.JWT_SECRET);
        decodedRefreshToken = await jwt.verify(refreshToken, user.salt + process.env.JWT_REFRESH_SECRET);
        response.user = user;
    } catch(err) {
        response.error = [err];
    }
    return response;
}*/

const _decrypt = (text) => {
    const decipher = crypto.createDecipher(process.env.JWT_CRYPTO_ALGORITHM, process.env.JWT_CRYPTO_PASSWORD)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

export default { store, list };