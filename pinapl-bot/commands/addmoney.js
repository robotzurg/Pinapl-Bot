const db = require('../db.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addmoney')
		.setDescription('Add money to a users account.')
		.addUserOption(option => 
			option.setName('user')
				.setDescription('The user to add money to.')
				.setRequired(true))
		.addIntegerOption(option => 
			option.setName('amount')
				.setDescription('The amount of money to give.')
				.setRequired(true))
		.addStringOption(option => 
			option.setName('type')
				.setDescription('The type of currency to give.')
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
		.addBooleanOption(option => 
			option.setName('all')
				.setDescription('Give to everyone?')
				.setRequired(false)),
	admin: true,
	async execute(interaction) {

		if (interaction.user.id === '122568101995872256' || interaction.user.id === '145267507844874241') {

			let args = [];
			args[0] = interaction.options._hoistedOptions[0].value;
			args[1] = interaction.options._hoistedOptions[1].value;
			args[2] = interaction.options._hoistedOptions[2].value;
			if (interaction.options._hoistedOptions[3] != undefined) {
				args[3] = interaction.options._hoistedOptions[3].value;
			} else {
				args[3] = false;
			}

			if (args[3] === false) {
				if (args[2] === 'pp') {
					let prevBalance = db.balances.get(args[0]);
					if (prevBalance === undefined) prevBalance = false;

					if (prevBalance === false) {
						db.balances.set(args[0], args[1]);
					} else {
						db.balances.set(args[0], prevBalance + args[1]);
					}
					interaction.editReply(`Added ${args[1]}<:pp:772971222119612416> to <@${args[0]}>'s account.`);
					interaction.channel.send(`Money in account: \`${db.balances.get(args[0])}\``);
				} else {
					let prevBalance = db.mmbalances.get(args[0]);
					if (prevBalance === undefined) prevBalance = false;

					if (prevBalance === false) {
						db.mmbalances.set(args[0], args[1]);
					} else {
						db.mmbalances.set(args[0], prevBalance + args[1]);
					}
					interaction.editReply(`Added ${args[1]}<:mm:839540228859625522> to <@${args[0]}>'s account.`);
					interaction.channel.send(`Money in account: \`${db.mmbalances.get(args[0])}\``);
				}
			} else {
				let keyArr = db.balances.keyArray();
				if (args[2] === 'pp') {
					for (let i = 0; i < keyArr.length; i++) {
						let prevBalance = db.balances.get(keyArr[i]);
						if (prevBalance === undefined) prevBalance = false;
						
						if (prevBalance === false) {
							db.balances.set(keyArr[i], args[1]);
						} else {
							db.balances.set(keyArr[i], prevBalance + args[1]);
						}
					}
					interaction.editReply(`Added ${args[1]}<:pp:772971222119612416> to all accounts.`);
				} else {
					for (let i = 0; i < keyArr.length; i++) {
						let prevBalance = db.mmbalances.get(keyArr[i]);
						if (prevBalance === undefined) prevBalance = false;
						
						if (prevBalance === false) {
							db.mmbalances.set(keyArr[i], args[1]);
						} else {
							db.mmbalances.set(keyArr[i], prevBalance + args[1]);
						}
					}
					interaction.editReply(`Added ${args[1]}<:mm:839540228859625522> to all accounts.`);
				}
			}
		} else {
			interaction.editReply('This command is not for you!');
		}
	},
};
