const db = require('../db.js');

module.exports = {
    name: 'work',
    description: 'Work for the day!',
    options: [],
    admin: false,
    execute(interaction) {
        if (db.workList.get('workerList').includes(parseInt(interaction.user.id))) return interaction.editReply('You feel pretty tired... You won\'t be able to work for a while.');
		interaction.editReply('You work diligently and get 15 <:pp:772971222119612416> for your hard work. Good job!\nYou won\'t be able to mine for a while.');
		db.balances.math(interaction.user.id, '+', 15);
		db.workList.push('workerList', parseInt(interaction.user.id));
		if (db.workList.has(interaction.user.id)) {
			db.workList.set(interaction.user.id, db.workList.get(interaction.user.id, 'streak') + 1, 'streak');
			db.workList.set(interaction.user.id, true, 'worked');
			let num = db.workList.get(interaction.user.id, 'streak');

			if (num % 5 == 0) {
				interaction.channel.send('You\'ve worked 5 days in a row! Here\'s your bonus. 100 <:pp:772971222119612416>!');
				db.workList.set(interaction.user.id, 0, 'streak');
				db.balances.math(interaction.user.id, '+', 100);
			}
		} else {
			db.workList.set(interaction.user.id, {
				streak: 1,
				worked: true,
			});
		}
    },
};