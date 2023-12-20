const db = require('../db.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removeshopitem')
		.setDescription('Remove an item from the shop.')
		.addStringOption(option => 
			option.setName('name')
				.setDescription('The name of the item being removed.')
				.setRequired(true))
		.addStringOption(option => 
			option.setName('shop_type')
				.setDescription('The shop to remove the item from.')
                .setRequired(true)
                .addChoices(
					{ name: 'Pinapl Points', value: 'pp' },
					{ name: 'Murder Money', value: 'mm' },
				))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	execute(interaction) {
		if (interaction.options._hoistedOptions[1].value === 'pp') {
			db.shop.delete(interaction.options._hoistedOptions[0].value);
			interaction.reply(`Removed ${interaction.options._hoistedOptions[0].value} from the pp shop.`);
		} else {
			db.mmshop.delete(interaction.options._hoistedOptions[0].value);
			interaction.reply(`Removed ${interaction.options._hoistedOptions[0].value} from the mm shop.`);
		}
	},
};