const db = require('../db.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removemoney')
		.setDescription('Remove money from a users account.')
		.addUserOption(option => 
			option.setName('user')
				.setDescription('The user to take money from.')
				.setRequired(true))
		.addIntegerOption(option => 
			option.setName('amount')
				.setDescription('The amount of money taken.')
				.setRequired(true))
		.addStringOption(option => 
			option.setName('type')
				.setDescription('The type of currency you are taking.')
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
	async execute(interaction) {

		if (interaction.user.id === '122568101995872256' || interaction.user.id === '145267507844874241') {

			let args = [];
			args[0] = interaction.options._hoistedOptions[0].value;
			args[1] = interaction.options._hoistedOptions[1].value;
			args[2] = interaction.options._hoistedOptions[2].value;

			if (args[2] === 'pp') {
				let prevBalance = db.balances.get(args[0]);
				if (prevBalance === undefined) prevBalance = false;

				if (prevBalance === false) {
					return interaction.editReply('No balance for this user exists. Make an account for them!');
				} else {
					db.balances.set(args[0], prevBalance - args[1]);
				}
				interaction.editReply(`Removed ${args[1]}<:pp:772971222119612416> from <@${args[0]}>'s account.`);
				interaction.channel.send(`Money in account: \`${db.balances.get(args[0])}\``);
			} else {
				let prevBalance = db.mmbalances.get(args[0]);
				if (prevBalance === undefined) prevBalance = false;

				if (prevBalance === false) {
					return interaction.editReply('No balance for this user exists. Make an account for them!');
				} else {
					db.mmbalances.set(args[0], prevBalance - args[1]);
				}
				interaction.editReply(`Removed ${args[1]}<:mm:839540228859625522> from <@${args[0]}>'s account.`);
				interaction.channel.send(`Money in account: \`${db.mmbalances.get(args[0])}\``);
			}
		} else {
			interaction.editReply(`This command isn't for you!`);
		}
	},
};
		