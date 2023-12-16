const db = require('../db.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work for the day!'),
    execute(interaction) {
        if (db.workList.get('workerList').includes(parseInt(interaction.user.id))) return interaction.reply('You feel pretty tired... You won\'t be able to work for a while.');
		db.balances.math(interaction.user.id, '+', 10);
		db.workList.push('workerList', parseInt(interaction.user.id));

		let num = 1;

		if (db.workList.has(interaction.user.id)) {
			db.workList.set(interaction.user.id, db.workList.get(interaction.user.id, 'streak') + 1, 'streak');
			db.workList.set(interaction.user.id, true, 'worked');
			num = db.workList.get(interaction.user.id, 'streak');

			if (num === 7) {
				interaction.channel.send('**You\'ve worked 7 days in a row! Here\'s your bonus. 50 <:pp:772971222119612416>!**');
				db.balances.math(interaction.user.id, '+', 50);
			} else if (num === 30) {
				interaction.channel.send('**You\'ve worked 30 days in a row!!! Here\'s your bonus, you amazing employee! 500 <:pp:772971222119612416>!**');
				db.balances.math(interaction.user.id, '+', 500);
				db.workList.set(interaction.user.id, 0, 'streak');
			}
		} else {
			db.workList.set(interaction.user.id, {
				streak: 1,
				worked: true,
			});
		}

		interaction.reply('You work diligently and get **10** <:pp:772971222119612416> for your hard work.\nGood job!\nYou won\'t be able to mine until the next work reset.' + 
		`\n\n**Streak progress:** Day ${num} out of 30 ${(num < 7) ? `(${7 - num} day(s) until next reward!)` : `(${30 - num} day(s) until next reward!)`}`);
    },
};
