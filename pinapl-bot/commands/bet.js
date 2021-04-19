const db = require('../db.js');
const Discord = require('discord.js');

// Set up random number function
function randomNumber(min, max) {  
    return Math.random() * (max - min) + min; 
}  

module.exports = {
	name: 'bet',
	type: 'Shop',
    description: 'Bet up to 100 <:pp:772971222119612416>.',
	args: true,
	usage: `<amount>`,
    cooldown: 1800,
	execute(message, args) {
        let bet_amt = parseInt(args[0]);
        if (bet_amt <= 0 || isNaN(bet_amt)) {
            return message.channel.send('Invalid amount to bet!');
        }
        const rand_amt_plr = Math.round(randomNumber(0, 50));
        const rand_amt_bot = Math.round(randomNumber(0, 50));
        let new_amt;

        if (bet_amt > db.balances.get(message.author.id)) {
            return message.channel.send(`You don't have that much money to bet!\nYour current balance is **${db.balances.get(message.author.id)}**<:pp:772971222119612416>.`);
        }

        const betEmbed = new Discord.MessageEmbed()

        .setColor('#ffff00')
        .setTitle(`<:botrng:831955715803316339> Pinapl's Casino <:botrng:831955715803316339>`)
        .setDescription(`You are betting **${bet_amt}**<:pp:772971222119612416>.`)
        .addField(`Your roll:`, `${rand_amt_plr}`)
        .addField(`The dealers roll:`, `${rand_amt_bot}`);

        if (rand_amt_bot > rand_amt_plr) {
            new_amt = db.balances.get(message.author.id) - bet_amt;
            db.balances.set(message.author.id, new_amt);
            betEmbed.addField(`<:botdead:773283710744789013> You have lost the bet. <:botdead:773283710744789013>`, `**${bet_amt}**<:pp:772971222119612416> has been taken from your balance.\n\`Your new balance is ${db.balances.get(message.author.id)}\`<:pp:772971222119612416>`);
            if (message.author.id != '145267507844874241') { db.balances.math('145267507844874241', '+', bet_amt); }

        } else if (rand_amt_plr > rand_amt_bot) {
            new_amt = (db.balances.get(message.author.id) + bet_amt);
            db.balances.set(message.author.id, new_amt);
            betEmbed.addField(`:tada: You have won the bet! :tada:`, `**${bet_amt}**<:pp:772971222119612416> has been added to your balance.\n\`Your new balance is ${db.balances.get(message.author.id)}\`<:pp:772971222119612416>`);
            
        } else if (rand_amt_bot === rand_amt_plr) {
            betEmbed.addField(`You have tied the bet... Therefore you get nothing.`, `${bet_amt}<:pp:772971222119612416> has been added back into your balance.`);
        }

        betEmbed.setFooter(`You can bet again in 30 minutes.`);
        message.channel.send(betEmbed);
	},
};