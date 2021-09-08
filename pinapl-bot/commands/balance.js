const db = require('../db.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Check a balance of you or another user.')
		.addStringOption(option => 
			option.setName('type')
				.setDescription('What balance to check!')
				.setRequired(true)
                .addChoices([
					[
						'Pinapl Points',
						'pp',
					], [
						'Murder Money',
						'mm',
					],
				]))
		.addUserOption(option => 
			option.setName('user')
				.setDescription('The user to check the balance of. Defaults to yourself.')
				.setRequired(false)),
	admin: false,
	async execute(interaction) {
		let taggedUser;
		const shopType = interaction.options._hoistedOptions[0].value;
		if (shopType === 'pp') {
			if (interaction.options._hoistedOptions.length != 1) {
				taggedUser = interaction.options._hoistedOptions[1].value;
				taggedUser = await interaction.guild.members.fetch(taggedUser);
				interaction.editReply(`**${taggedUser.user.username}** has **${db.balances.get(taggedUser.user.id)}** <:pp:772971222119612416> in their account.`);
			} else {
				taggedUser = interaction.user;
				interaction.editReply(`You have **${db.balances.get(taggedUser.id)}** <:pp:772971222119612416> in your account.`);
			}	
		} else {
			if (interaction.options._hoistedOptions.length != 1) {
				taggedUser = interaction.options._hoistedOptions[1].value;
				taggedUser = await interaction.guild.members.fetch(taggedUser);
				interaction.editReply(`**${taggedUser.user.username}** has **${db.mmbalances.get(taggedUser.user.id)}** <:mm:839540228859625522> in their account.`);
			} else {
				taggedUser = interaction.user;
				interaction.editReply(`You have **${db.mmbalances.get(taggedUser.id)}** <:mm:839540228859625522> in your account.`);
			}	
		}
	},
};