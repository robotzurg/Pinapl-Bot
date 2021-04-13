const db = require('../db.js');
const { capitalize } = require('../func.js');

module.exports = {
	name: 'removeshopitem',
	aliases: ['removeshopitem', 'rsi'],
	type: 'Admin',
    description: 'Remove an item from the shop.',
	args: true,
	usage: `<name>`,
	execute(message, args) {
        if (message.member.hasPermission('ADMINISTRATOR') || message.author.id === '122568101995872256') {
			args[0] = capitalize(args[0]);
            db.shop.delete(args[0]);
            message.channel.send(`Removed ${args[0]} from the shop.`);
        }
	},
};