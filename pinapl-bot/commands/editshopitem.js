const db = require('../db.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editshopitem')
        .setDescription('Edit an item in the shop.')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('The name of the item.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('value')
                .setDescription('What part of the item is being edited.')
                .setRequired(true)
                .addChoices(
					{ name: 'Description', value: 'desc' },
					{ name: 'Cost', value: 'cost' },
					{ name: 'Emoji', value: 'emoji' },
				))
        .addStringOption(option => 
            option.setName('data')
                .setDescription('The new data for the item.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('shop_type')
                .setDescription('The shop the item is in.')
                .setRequired(true)
                .addChoices(
					{ name: 'Pinapl Points', value: 'pp' },
					{ name: 'Murder Money', value: 'mm' },
				))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	execute(interaction) {
        if (interaction.options._hoistedOptions[3].value === 'pp') {
            console.log(interaction.options._hoistedOptions[0].value);
            if (!db.shop.has(interaction.options._hoistedOptions[0].value)) return interaction.reply('Item does not exist!');

            switch(interaction.options._hoistedOptions[1].value) {
                case 'desc': db.shop.set(interaction.options._hoistedOptions[0].value, interaction.options._hoistedOptions[2].value, 'desc'); break;
                case 'cost': db.shop.set(interaction.options._hoistedOptions[0].value, parseInt(interaction.options._hoistedOptions[2].value), 'cost'); break;
                case 'emoji': db.shop.set(interaction.options._hoistedOptions[0].value, interaction.options._hoistedOptions[2].value, 'emoji'); break;
            }
        } else {
            if (!db.mmshop.has(interaction.options._hoistedOptions[0].value)) return interaction.reply('Item does not exist!');

            switch(interaction.options._hoistedOptions[1].value) {
                case 'desc': db.mmshop.set(interaction.options._hoistedOptions[0].value, interaction.options._hoistedOptions[2].value, 'desc'); break;
                case 'cost': db.mmshop.set(interaction.options._hoistedOptions[0].value, parseInt(interaction.options._hoistedOptions[2].value), 'cost'); break;
                case 'emoji': db.mmshop.set(interaction.options._hoistedOptions[0].value, interaction.options._hoistedOptions[2].value, 'emoji'); break;
            }
        }

        interaction.reply(`Edited ${interaction.options._hoistedOptions[0].value}.`);
	},
};