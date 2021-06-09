const db = require('../db.js');

module.exports = {
	name: 'balance',
    description: 'Check a shop balance of you or another user.',
	options: [
		{
			name: 'type',
			type: 'STRING',
			description: 'What balance you want to check.',
			required: true,
			choices: [
				{ name: 'Pinapl Points', value: 'pp' },
				{ name: 'Murder Money', value: 'mm' },
			],
		}, {
			name: 'user',
			type: 'USER',
			description: 'The user that you would like to check the balance of. Defaults to yourself.',
			required: false,
		},
	],
	admin: false,
	async execute(interaction) {
		let taggedUser;
		const shopType = interaction.options[0].value;
		if (shopType === 'pp') {
			if (interaction.options.length != 1) {
				taggedUser = interaction.options[1].value;
				taggedUser = await interaction.guild.members.fetch(taggedUser);
				interaction.editReply(`**${taggedUser.user.username}** has **${db.balances.get(taggedUser.user.id)}** <:pp:772971222119612416> in their account.`);
			} else {
				taggedUser = interaction.user;
				interaction.editReply(`You have **${db.balances.get(taggedUser.id)}** <:pp:772971222119612416> in your account.`);
			}	
		} else {
			if (interaction.options.length != 1) {
				taggedUser = interaction.options[1].value;
				taggedUser = await interaction.guild.members.fetch(taggedUser);
				interaction.editReply(`**${taggedUser.user.username}** has **${db.mmbalances.get(taggedUser.user.id)}** <:mm:839540228859625522> in their account.`);
			} else {
				taggedUser = interaction.user;
				interaction.editReply(`You have **${db.mmbalances.get(taggedUser.id)}** <:mm:839540228859625522> in your account.`);
			}	
		}
	},
};