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
        }, {
            name: 'shop_type',
            type: 'STRING',
            description: 'What shop the item belongs to.',
            required: true,
            choices: [
				{ name: 'Pinapl Points', value: 'pp' },
				{ name: 'Murder Money', value: 'mm' },
			],
        }, 
    ],
	admin: true,
	execute(interaction) {
        if (interaction.options._hoistedOptions[1].value === 'pp') {
            db.shop.delete(interaction.options._hoistedOptions[0].value);
            interaction.editReply(`Removed ${interaction.options._hoistedOptions[0].value} from the pp shop.`);
        } else {
            db.mmshop.delete(interaction.options._hoistedOptions[0].value);
            interaction.editReply(`Removed ${interaction.options._hoistedOptions[0].value} from the mm shop.`);
        }
	},
};