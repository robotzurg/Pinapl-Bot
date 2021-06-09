const db = require('../db.js');

module.exports = {
	name: 'addshopitem',
    description: 'Add a new item to the shop.',
	options: [
        {
            name: 'name',
            type: 'STRING',
            description: 'The name of the item being added.',
            required: true,
        }, {
            name: 'cost',
            type: 'INTEGER',
            description: 'The amount of pp the item costs.',
            required: true,
        }, {
            name: 'description',
            type: 'STRING',
            description: 'Description of the item.',
            required: true,
        }, {
            name: 'emoji',
            type: 'STRING',
            description: 'The emoji attached to the item.',
            required: true,
        }, {
            name: 'shop',
            type: 'STRING',
            description: 'Which shop to add the item to',
            required: true,
            choices: [
				{ name: 'Pinapl Points', value: 'pp' },
				{ name: 'Murder Money', value: 'mm' },
			],
        },
    ],
	admin: true,
	execute(interaction) {
        const item_name = interaction.options[0].value;
        const cost = interaction.options[1].value;
        const desc = interaction.options[2].value;
        const emoji = interaction.options[3].value;
        const shop_type = interaction.options[4].value;

        if (shop_type === 'pp') {
            db.shop.set(item_name, {
                cost: cost,
                desc: desc,
                emoji: emoji, 
            });
        } else {
            db.mmshop.set(item_name, {
                cost: cost,
                desc: desc,
                emoji: emoji, 
            });
        }

        interaction.editReply(`Added ${item_name} to the shop.`);
	},
};