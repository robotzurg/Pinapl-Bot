const db = require('../db.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

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
                .addChoices([
					[
						'Pinapl Points',
						'pp',
					], [
						'Murder Money',
						'mm',
					],
				])),
	admin: true,
	execute(interaction) {

		if (interaction.user.id === '122568101995872256' || interaction.user.id === '145267507844874241') {

			if (interaction.options._hoistedOptions[1].value === 'pp') {
				db.shop.delete(interaction.options._hoistedOptions[0].value);
				interaction.editReply(`Removed ${interaction.options._hoistedOptions[0].value} from the pp shop.`);
			} else {
				db.mmshop.delete(interaction.options._hoistedOptions[0].value);
				interaction.editReply(`Removed ${interaction.options._hoistedOptions[0].value} from the mm shop.`);
			}

		} else {
			interaction.editReply(`This command isn't for you!`);
		}
	},
};