const db = require('../db.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Display your user profile!')
        .addStringOption(option => 
			option.setName('profile_type')
				.setDescription('What part of the profile you want to see.')
                .setRequired(true)
                .addChoices(
                    { name: 'General Casino', value: 'casino' },
                    { name: 'Betting', value: 'betting' },
                    { name: 'Slots', value: 'slots' },
                )),
	async execute(interaction) {
            let profile_type = interaction.options.getString('profile_type');
            let statsObj = db.profile.get(interaction.user.id, profile_type);
            let profileEmbed;

            if (profile_type === 'murder') {

                profileEmbed = new Discord.MessageEmbed()
                .setColor('#ffff00')
                .setTitle(`⚔ Murder Royale Stats ⚔`)
                .addField(`🏅 Games Played:`, `**${statsObj.games_played}**`, true)
                .addField(`🏅 Games Won:`, `**${statsObj.games_won}**`, true)
                .addField(`🎲 Games:`, `**${statsObj.games_list.join(', ')}**`, false)
                .addField(`🔪 Best Kill Streak:`, `**${statsObj.kill_streak}**`, true)
                .addField(`🔪 K/D Ratio:`, `**${statsObj.kd_ratio}**`, true)
                .addField(`🔪 Total Kills:`, `**${statsObj.kills}**`, true)
                .setFooter(`Profile for ${interaction.member.displayName}`, interaction.user.avatarURL({ format: "png" }));
                
            } else if (profile_type === 'casino') {
                profileEmbed = new Discord.MessageEmbed()
                .setColor('#ffff00')
                .setTitle(`<:pinapl:771375082966220830> Pinapl's Casino Stats <:pinapl:771375082966220830>`)
                .addField(`<:pp:772971222119612416> PP Balance:`, `**${db.balances.get(interaction.user.id)}**`, false)
                .addField(`📦 Crates Grabbed:`, `**${statsObj.crates}**`, true)
                .addField(`🎁 Items Bought:`, `**${statsObj.items_bought}**`, true)
                .addField(`🎲 Casino Games Played:`, `**${statsObj.games_played}**`, false)
                .addField(`🏆 PP Won:`, `**${statsObj.pp_won}**`, true)
                .addField(`💔 PP Lost:`, `**${statsObj.pp_lost}**`, true)
                .setFooter(`Profile for ${interaction.member.displayName}`, interaction.user.avatarURL({ format: "png" }));
                
            } else if (profile_type === 'betting') {
                profileEmbed = new Discord.MessageEmbed()
                .setColor('#ffff00')
                .setTitle(`<:botrng:831955715803316339> Betting Stats <:botrng:831955715803316339>`)
                .addField(`<:botrng:831955715803316339> Bets Played:`, `**${statsObj.games_played}**`, false)
                .addField(`<:botyes:831953510655721472> Bets Won:`, `**${statsObj.games_won}**`, true)
                .addField(`<:botmaybe:854041247626166312> Bets Tied:`, `**${statsObj.games_tied}**`, true)
                .addField(`<:botno:773619578336837644> Bets Lost:`, `**${statsObj.games_lost}**`, true)
                .addField(`🏆 PP Won:`, `**${statsObj.pp_won}**`, true)
                .addField(`💔 PP Lost:`, `**${statsObj.pp_lost}**`, true)
                .setFooter(`Profile for ${interaction.member.displayName}`, interaction.user.avatarURL({ format: "png" }));
                
            } else if (profile_type === 'slots') {
                profileEmbed = new Discord.MessageEmbed()
                .setColor('#ffff00')
                .setTitle(`🎰 Slots Stats 🎰`)
                .addField(`🎰 Slots Played:`, `**${statsObj.games_played}**`, false)
                .addField(`<:rainbowwoke:850098513718018069> Jackpot Outcomes: `, `**${statsObj.jackpot}**`, true)
                .addField(`<:botslime:771428142085701653> Positive Outcomes: `, `**${statsObj.positive}**`, true)
                .addField(`<:botmaybe:854041247626166312> Neutral Outcomes: `, `**${statsObj.neutral}**`, false)
                .addField(`<:botno:773619578336837644> Negative Outcomes: `, `**${statsObj.negative}**`, true)
                .addField(`<:botmad:771375079249543188> Adios Outcomes: `, `**${statsObj.adios}**`, true)
                .addField(`🏆 PP Won:`, `**${statsObj.pp_won}**`, false)
                .addField(`💔 PP Lost:`, `**${statsObj.pp_lost}**`, true)
                .setFooter(`Profile for ${interaction.member.displayName}`, interaction.user.avatarURL({ format: "png" }));
                
            }

            interaction.reply({ embeds: [profileEmbed] });
	},
};