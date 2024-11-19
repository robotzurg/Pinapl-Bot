const db = require('../db.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Check a balance of you or another user.')
		.addSubcommand(subcommand =>
			subcommand.setName('pp')
				.setDescription('View your Pinapl Points balance.')
				.addUserOption(option => 
					option.setName('user')
						.setDescription('The user to check the balance of. Defaults to yourself.')
						.setRequired(false)))

		.addSubcommand(subcommand =>
			subcommand.setName('mm')
				.setDescription('View your Murder Money balance.')
				.addUserOption(option => 
					option.setName('user')
						.setDescription('The user to check the balance of. Defaults to yourself.')
						.setRequired(false))),
	async execute(interaction) {
		let taggedUser;
		const shopType = interaction.options.getSubcommand();
		if (shopType === 'pp') {
			if (interaction.options.getUser('user') != null) {
				taggedUser = interaction.options.getUser('user');
				taggedUser = await interaction.guild.members.fetch(taggedUser);
				interaction.reply(`**${taggedUser.displayName}** has **${db.balances.get(taggedUser.user.id)}** <:pp:772971222119612416> in their account.`);
			} else {
				taggedUser = interaction.user;
				interaction.reply(`You have **${db.balances.get(taggedUser.id)}** <:pp:772971222119612416> in your account.`);
			}	
		} else {
			if (interaction.options.getUser('user') != null) {
				taggedUser = interaction.options.getUser('user');
				taggedUser = await interaction.guild.members.fetch(taggedUser);
				interaction.reply(`**${taggedUser.displayName}** has **${db.mmbalances.get(taggedUser.user.id)}** <:mm:839540228859625522> in their account.`);
			} else {
				taggedUser = interaction.user;
				interaction.reply(`You have **${db.mmbalances.get(taggedUser.id)}** <:mm:839540228859625522> in your account.`);
			}	
		}
	},
};