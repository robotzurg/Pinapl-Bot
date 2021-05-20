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
            name: 'amount_of_pp',
            type: 'INTEGER',
            description: 'The amount of pp given.',
            required: true,
        },
    ],
	admin: true,
	async execute(interaction) {
		let args = [];
		args[0] = interaction.options[0].value;
		args[1] = interaction.options[1].value;
		let prevBalance = db.balances.get(args[0]);
		if (prevBalance === undefined) prevBalance = false;

		if (prevBalance === false) {
			db.balances.set(args[0], args[1]);
		} else {
			db.balances.set(args[0], prevBalance + args[1]);
		}
		interaction.editReply(`Added ${args[1]}<:pp:772971222119612416> to <@${args[0]}>'s account.`);
		interaction.channel.send(`Money in account: \`${db.balances.get(args[0])}\``);
	},
};