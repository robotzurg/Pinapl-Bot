const db = require('../db.js');
const Discord = require('discord.js');

module.exports = {
	name: 'leaderboard',
    description: 'See whats in the shop!',
	options: [],
	admin: false,
	async execute(interaction) {
        /*// Gives you an array
        const keyArray = db.balances.keyArray();
        let leaderboardArray = [];
        for (let i = 0; i < keyArray.length; i++) {
            leaderboardArray.push([keyArray[i], db.balances.get(keyArray[i])]);
        }

        const yourBalance = db.balances.get(interaction.user.id);
        let yourPlacement = 0;

        leaderboardArray = leaderboardArray.sort((a, b) => b[1] - a[1]);
        for (let i = 0; i < leaderboardArray.length; i++) {
            if (leaderboardArray[i][0] === interaction.user.id) {
                yourPlacement = i + 1;
            }
        }

        leaderboardArray = leaderboardArray.slice(0, 10);
        let embedLBArray = [];
        let username;

        for (let i = 0; i < leaderboardArray.length; i++) {
            console.log(leaderboardArray[i][0]);
            username = await interaction.guild.members.fetch(leaderboardArray[i][0]);
            username = username.displayName;
            embedLBArray.push(`**${i + 1}**. <:pp:772971222119612416> **${leaderboardArray[i][1]}**  ${username}`);
        }

        embedLBArray = embedLBArray.join('\n\n');

        const leaderboard = new Discord.MessageEmbed()

        .setColor('#ffff00')
        .setTitle(`Pinapl's Murder Royale Leaderboard`)
        .setDescription(embedLBArray);
        console.log(interaction.member);
        leaderboard.addField('══════════════════════════', `**${yourPlacement}**. <:pp:772971222119612416> **${yourBalance}** ${interaction.member.displayName}`);

        interaction.editReply({ embeds: [leaderboard] });*/
	interaction.editReply('This command is temporarily disabled.');
	},
};