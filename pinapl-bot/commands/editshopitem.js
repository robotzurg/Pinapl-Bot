const db = require('../db.js');

module.exports = {
	name: 'editshopitem',
    description: 'Edit an item in the shop.',
	options: [
        {
            name: 'name',
            type: 'STRING',
            description: 'The name of the item being edited.',
            required: true,
        }, {
            name: 'value',
            type: 'STRING',
            description: 'What part of the item is being edited.',
            required: true,
			choices: [
				{ name: 'Description', value: 'desc' },
				{ name: 'Cost', value: 'cost' },
				{ name: 'Emoji', value: 'emoji' },
			],
        }, {
            name: 'data',
            type: 'STRING',
            description: 'The new data for the item.',
            required: true,
        },
    ],
	admin: true,
	execute(interaction) {
		if (!db.shop.has(interaction.options[0].value)) return interaction.editReply('Item does not exist!');

		switch(interaction.options[1].value) {
			case 'desc': db.shop.set(interaction.options[0].value, interaction.options[2].value, 'desc'); break;
			case 'cost': db.shop.set(interaction.options[0].value, parseInt(interaction.options[2].value), 'cost'); break;
			case 'emoji': db.shop.set(interaction.options[0].value, interaction.options[2].value, 'emoji'); break;
		}

		interaction.editReply(`Edited ${interaction.options[0].value}.`);
	},
};