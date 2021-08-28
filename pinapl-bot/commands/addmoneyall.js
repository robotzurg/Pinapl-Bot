const db = require('../db.js');

module.exports = {
	name: 'addmoney',
    description: 'Add money to someones account.',
	options: [
		   {
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
		args[0] = interaction.options._hoistedOptions[0].value;
		args[1] = interaction.options._hoistedOptions[1].value;
		
		let bal_arr = db.balances.keyArray()

		for (let i = 0; i <= bal_arr.length; i++) {
			if (args[1] === 'pp') {
				let prevBalance = db.balances.get(bal_arr[i]);
				if (prevBalance === undefined) prevBalance = false;

				if (prevBalance === false) {
					db.balances.set(bal_arr[i], args[0]);
				} else {
					db.balances.set(bar_arr[i], prevBalance + args[0]);
				}
				interaction.editReply(`Added ${args[0]}<:pp:772971222119612416> to all accounts.`);
			} else {
				let prevBalance = db.mmbalances.get(bal_arr[i]);
				if (prevBalance === undefined) prevBalance = false;

				if (prevBalance === false) {
					db.mmbalances.set(bal_arr[i], args[0]);
				} else {
					db.mmbalances.set(bal_arr[i], prevBalance + args[0]);
				}
				interaction.editReply(`Added ${args[0]}<:mm:839540228859625522> to all accounts.`);
			}
		}
	},
};
