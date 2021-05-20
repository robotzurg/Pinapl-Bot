const db = require('../db.js');

module.exports = {
	name: 'balance',
    description: 'Check a shop balance of you or another user.',
	options: [{
		name: 'user',
		type: 'USER',
		description: 'The user that you would like to check the balance of. Defaults to yourself.',
		required: false,
	}],
	admin: false,
	async execute(interaction) {
		let taggedUser;
		if (interaction.options.length != 0) {
			taggedUser = interaction.options[0].value;
			taggedUser = await interaction.guild.members.fetch(taggedUser);
			interaction.editReply(`**${taggedUser.user.username}** has **${db.balances.get(taggedUser.user.id)}** <:pp:772971222119612416> in their account.`);
		} else {
			taggedUser = interaction.user;
			interaction.editReply(`You have **${db.balances.get(taggedUser.id)}** <:pp:772971222119612416> in your account.`);
		}	
	},
};