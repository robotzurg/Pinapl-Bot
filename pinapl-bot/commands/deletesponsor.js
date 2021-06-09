const db = require('../db.js');
const { updateSponsorList } = require('../func.js');

module.exports = {
	name: 'deletesponsor',
    description: 'Delete a sponsor in the games',
    options: [],
    admin: true,
	execute(message, args) {
        const item = args[0];
        if (db.airdrop.has(item)) {
            db.airdrop.delete(item);
            updateSponsorList(message);
            message.channel.send(`Successfully deleted ${item} from the cornucopia list.`);
        } else if (db.priority_airdrop.has(item)) {
            db.backpack.set(db.priority_airdrop.get(item), false, 'sponsored_item');
            db.priority_airdrop.delete(item);
            updateSponsorList(message);
            message.channel.send(`Successfully deleted ${item} from the daily sponsor list.`);
        } else {
            return message.channel.send('This sponsor does not exist.');
        }
	},
};