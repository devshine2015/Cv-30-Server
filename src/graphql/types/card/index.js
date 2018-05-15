import User from '../user';
import Contact from './contacts';
import Image from './images';
import Settings from './settings';
import Social from './social';
import Stats from './stats';
import Texts from './texts';

const Card = `
	type Card {
		id: Int!
		user: User!
		contacts: [CardContact]
		images: [CardImage]
		settings: CardSettings
		social: [CardSocial]
		stats: CardStats
		texts: [CardText]
		error: [String]
	}
	input CardInput {
		id: Int!
		contacts: [CardContactInput]
		images: [CardImageInput]
		settings: CardSettingsInput
		social: [CardSocialInput]
		stats: CardStatsInput
		texts: [CardTextInput]
	}
`;

export default () => [Card, User, Contact, Image, Settings, Social, Stats, Texts];