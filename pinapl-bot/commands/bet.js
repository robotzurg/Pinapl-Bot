const db = require('../db.js');
const Discord = require('discord.js');

// Set up random number function
function randomNumber(min, max) {  
    return Math.random() * (max - min) + min; 
}  

module.exports = {
	name: 'bet',
    description: 'Bet up to 100 <:pp:772971222119612416>.',
    options: [{
        name: 'number_of_pp',
        type: 'INTEGER',
        description: 'Number of pp to bet!',
        required: true,
    }],
    cooldown: 1800,
	execute(interaction) {
        let bet_amt = parseInt(interaction.options._hoistedOptions._hoistedOptions[0].value);
        const rand_amt_plr = Math.round(randomNumber(0, 50));
        const rand_amt_bot = Math.round(randomNumber(0, 50));
        let new_amt;

        if (bet_amt > db.balances.get(interaction.user.id)) {
            return interaction.editReply(`You don't have that much money to bet!\nYour current balance is **${db.balances.get(interaction.user.id)}**<:pp:772971222119612416>.`);
        }

        const betEmbed = new Discord.MessageEmbed()

        .setColor('#ffff00')
        .setTitle(`<:botrng:831955715803316339> Pinapl's Casino <:botrng:831955715803316339>`)
        .setDescription(`You are betting **${bet_amt}**<:pp:772971222119612416>.`)
        .addField(`Your roll:`, `${rand_amt_plr}`)
        .addField(`The dealers roll:`, `${rand_amt_bot}`);

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

        betEmbed.setFooter(`You can bet again in 30 minutes.`);
        interaction.editReply({ embeds: [betEmbed] });
	},
};