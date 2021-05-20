const db = require('../db.js');

module.exports = {
	name: 'addaccount',
    description: 'Add a new money account for a user.',
	options: [
        {
            name: 'discord_tag',
            type: 'STRING',
            description: 'The user to add an account for.',
            required: true,
        }, {
            name: 'amount_of_pp',
            type: 'INTEGER',
            description: 'The starting number of pp.',
            required: true,
        },
    ],
	admin: true,
	execute(interaction) {
		const user = interaction.options[0].value;
		const amt = interaction.options[1].value;

		db.balances.set(user, amt);

		interaction.editReply(`Made <@${user}> an account.`);
	},
};