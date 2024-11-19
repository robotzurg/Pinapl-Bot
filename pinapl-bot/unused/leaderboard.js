const db = require('../db.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Display the leaderboard for pp.'),
	async execute(interaction) {
        // Gives you an array
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
            username = await interaction.guild.members.fetch(leaderboardArray[i][0]);
            username = username.displayName;
            embedLBArray.push(`**${i + 1}**. <:pp:772971222119612416> **${leaderboardArray[i][1]}**  ${username}`);
        }

        embedLBArray = embedLBArray.join('\n\n');

        const leaderboard = new EmbedBuilder()

        .setColor('#ffff00')
        .setTitle(`Pinapl's Murder Royale <:pp:772971222119612416> Leaderboard`)
        .setDescription(embedLBArray);
        leaderboard.addFields([{ name: '══════════════════════════', value: `**${yourPlacement}**. <:pp:772971222119612416> **${yourBalance}** ${interaction.member.displayName}` }]);
        interaction.reply({ embeds: [leaderboard] });
	},
};