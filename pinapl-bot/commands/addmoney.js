const db = require('../db.js');

module.exports = {
	name: 'addmoney',
    description: 'Add money to someones account.',
	options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to give money to.',
            required: true,
        }, {
            name: 'amount',
            type: 'INTEGER',
            description: 'The amount of money given.',
            required: true,
        }, {
			name: 'type',
			type: 'STRING',
			description: 'The kind of currency you are giving.',
			required: true,
			choices: [
				{ name: 'Pinapl Points', value: 'pp' },
				{ name: 'Murder Money', value: 'mm' },
			],
		},
    ],
	admin: true,
	async execute(interaction) {
		let args = [];
		args[0] = interaction.options[0].value;
		args[1] = interaction.options[1].value;
		args[2] = interaction.options[2].value;

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
	},
};