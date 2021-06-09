const db = require('../db.js');
const { updateGameStatus, updateUserStatus } = require('../func.js');

module.exports = {
	name: 'reset',
    description: 'Reset the games.',
	options: [],
	admin: true,
	execute(interaction) {
		const tributeArray = db.tributes.keyArray();

		db.stats.set('Game Status', 'Closed');
		db.stats.set('Time', 'Day');
		db.stats.set('Players Left', tributeArray.length - 2);
		db.stats.set('Deaths Num', 0);
		db.stats.set('Deaths Users', []);
		db.stats.set('Day', 1);

		for (let i = 0; i < tributeArray.length; i++) {
			if (tributeArray[i] === 'Alive') {
				let aTributeArray = tributeArray.filter(key => key != 'Alive');
				aTributeArray = aTributeArray.filter(key => key != 'Dead');
				db.tributes.set('Alive', aTributeArray);
			} else if (tributeArray[i] === 'Dead') {
				db.tributes.set('Dead', []);
			} else {
				db.tributes.set(tributeArray[i], {
					health: 4,
					kill_num: 0,
					in_corn: true,
					action: false,
					inventory: [],
					status: "Alive",
				});
			}
		}

		if (db.stats.get('Game Status') === 'Closed') {
			updateGameStatus(interaction);
			updateUserStatus(interaction);
			return interaction.editReply('Game reset successfully.');
		} else {
			return interaction.editReply('Something went wrong!');
		}
	},
};