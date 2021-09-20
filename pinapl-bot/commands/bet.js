const db = require('../db.js');
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

// Set up random number function
function randomNumber(min, max) {  
    return Math.random() * (max - min) + min; 
}  

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bet')
		.setDescription('Bet pp to the Pinapl Casino!')
		.addIntegerOption(option => 
			option.setName('number_of_pp')
				.setDescription('Number of pp to bet!')
				.setRequired(true)),
	admin: false,
    cooldown: 900,
	execute(interaction) {
        let bet_amt = parseInt(interaction.options._hoistedOptions[0].value);
        let chance_modifier = 0;
        let new_amt;

        if (bet_amt > 1000) {
            return interaction.editReply('The Pinapl Casino rejects your money. Your money is returned.\nThe limit is 1000<:pp:772971222119612416>.');
        }

        if (bet_amt > db.balances.get(interaction.user.id)) {
            return interaction.editReply(`You don't have that much money to bet, you dingus.\nYour current balance is **${db.balances.get(interaction.user.id)}**<:pp:772971222119612416>.`);
        }
        
        if (bet_amt < 0) {
            return interaction.editReply(`You doofus you can't bet negative money are you TRYING TO SCAM THIS GOOD PINAPL CASINO, I WILL HAVE YOU THROWN OUT FOR YOUR CRIMES`);
        }

        if (bet_amt <= 333) {
            chance_modifier = 0;
        } else if (bet_amt >= 334 && bet_amt <= 666) {
            chance_modifier = 1;
        } else if (bet_amt >= 667 && bet_amt <= 1000) {
            chance_modifier = 2;
        }

        let rand_amt_plr = Math.round(randomNumber(0, 50));
        let rand_amt_bot = Math.round(randomNumber(0, 50));
        console.log(`Plr: ${rand_amt_plr}`);
        console.log(`Bot: ${rand_amt_bot}`);

        for (let i = 0; i < chance_modifier; i++) {
            if (rand_amt_bot <= rand_amt_plr) {
                rand_amt_plr = Math.round(randomNumber(0, 50));
                rand_amt_bot = Math.round(randomNumber(0, 50));
                console.log(`Plr Re-Roll #${i + 1}: ${rand_amt_plr}`);
                console.log(`Bot Re-Roll #${i + 1}: ${rand_amt_bot}`);
            } else {
                break;
            }
        }

        const betEmbed = new Discord.MessageEmbed()

        .setColor('#ffff00')
        .setTitle(`<:botrng:831955715803316339> Pinapl's Casino <:botrng:831955715803316339>`)
        .setDescription(`You are betting **${bet_amt}**<:pp:772971222119612416>.`)
        .addField(`Your roll:`, `${rand_amt_plr}`)
        .addField(`The dealers roll:`, `${rand_amt_bot}`)
        .setFooter(`You can bet again in 15 minutes.`);

        if (rand_amt_bot > rand_amt_plr) {
            new_amt = db.balances.get(interaction.user.id) - bet_amt;
            db.balances.set(interaction.user.id, new_amt);
            betEmbed.addField(`<:botdead:773283710744789013> You have lost the bet. <:botdead:773283710744789013>`, `**${bet_amt}**<:pp:772971222119612416> has been taken from your balance.\n\`Your new balance is ${db.balances.get(interaction.user.id)}\`<:pp:772971222119612416>`);
            if (interaction.user.id != '145267507844874241') { db.balances.math('145267507844874241', '+', bet_amt); }

        } else if (rand_amt_plr > rand_amt_bot) {
            new_amt = (db.balances.get(interaction.user.id) + bet_amt);
            db.balances.set(interaction.user.id, new_amt);
            betEmbed.addField(`:tada: You have won the bet! :tada:`, `**${bet_amt}**<:pp:772971222119612416> has been added to your balance.\n\`Your new balance is ${db.balances.get(interaction.user.id)}\`<:pp:772971222119612416>`);
            
        } else if (rand_amt_bot === rand_amt_plr) {
            betEmbed.addField(`You have tied the bet... Therefore you get nothing.`, `${bet_amt}<:pp:772971222119612416> has been added back into your balance.`);
        }

        interaction.editReply({ embeds: [betEmbed] });
	},
};
