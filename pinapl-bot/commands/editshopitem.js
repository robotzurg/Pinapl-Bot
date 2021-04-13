const db = require('../db.js');
const { capitalize } = require('../func.js');

module.exports = {
	name: 'editshopitem',
	aliases: ['editshopitem', 'esi'],
	type: 'Admin',
    description: 'Edit an item in the shop.',
	args: true,
	usage: `<name> | <value> | <data>`,
	execute(message, args) {
        if (message.member.hasPermission('ADMINISTRATOR') || message.author.id === '122568101995872256') {
			args[0] = capitalize(args[0]);
            if (!db.shop.has(args[0])) return message.channel.send('Item does not exist!');

			switch(args[1]) {
				case 'desc': db.shop.set(args[0], args[2], 'desc'); break;
				case 'cost': db.shop.set(args[0], args[2], 'cost'); break;
				case 'emoji': db.shop.set(args[0], args[2], 'emoji'); break;
			}

            message.channel.send(`Edited ${args[0]}.`);
        }
	},
};