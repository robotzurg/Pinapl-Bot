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
        }, {
            name: 'shop_type',
            type: 'STRING',
            description: 'What shop the item goes in.',
            required: true,
            choices: [
				{ name: 'Pinapl Points', value: 'pp' },
				{ name: 'Murder Money', value: 'mm' },
			],
        },
    ],
	admin: true,
	execute(interaction) {
        if (interaction.options[3].value === 'pp') {
            if (!db.shop.has(interaction.options[0].value)) return interaction.editReply('Item does not exist!');

            switch(interaction.options[1].value) {
                case 'desc': db.shop.set(interaction.options[0].value, interaction.options[2].value, 'desc'); break;
                case 'cost': db.shop.set(interaction.options[0].value, parseInt(interaction.options[2].value), 'cost'); break;
                case 'emoji': db.shop.set(interaction.options[0].value, interaction.options[2].value, 'emoji'); break;
            }
        } else {
            if (!db.mmshop.has(interaction.options[0].value)) return interaction.editReply('Item does not exist!');

            switch(interaction.options[1].value) {
                case 'desc': db.mmshop.set(interaction.options[0].value, interaction.options[2].value, 'desc'); break;
                case 'cost': db.mmshop.set(interaction.options[0].value, parseInt(interaction.options[2].value), 'cost'); break;
                case 'emoji': db.mmshop.set(interaction.options[0].value, interaction.options[2].value, 'emoji'); break;
            }
        }

		interaction.editReply(`Edited ${interaction.options[0].value}.`);
	},
};