const db = require('../db.js');

module.exports = {
	name: 'removeshopitem',
    description: 'Remove an item from the shop.',
	options: [
        {
            name: 'name',
            type: 'STRING',
            description: 'The name of the item being removed.',
            required: true,
        },
    ],
	admin: true,
	execute(interaction) {
		db.shop.delete(interaction.options[0].value);
		interaction.editReply(`Removed ${interaction.options[0].value} from the shop.`);
	},
};