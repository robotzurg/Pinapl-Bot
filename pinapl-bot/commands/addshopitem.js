const db = require('../db.js');
const { capitalize } = require('../func.js');

module.exports = {
	name: 'addshopitem',
	aliases: ['addshopitem', 'asi'],
	type: 'Admin',
    description: 'Add a new item to the shop.',
	args: true,
	usage: `<name> | <cost> | <description> | <emoji>`,
	execute(message, args) {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            args[0] = capitalize(args[0]);
            const item_name = args[0];
            const cost = args[1];
            const desc = args[2];
            const emoji = args[3];

            db.shop.set(item_name, {
                cost: cost,
                desc: desc,
                emoji: emoji, 
            });

            message.channel.send(`Added ${item_name} to the shop.`);
        }
	},
};