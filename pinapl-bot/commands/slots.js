const db = require('../db.js');
const Discord = require('discord.js');
const { weighted_random } = require('../func.js');
const { slotChance } = require('../arrays.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

// Set up random picking option
Array.prototype.random = function() {
    return this[Math.floor((Math.random() * this.length))];
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slots')
		.setDescription('Bet pp at the BOT MACHINE in Pinapl Casino!')
		.addIntegerOption(option => 
			option.setName('number_of_pp')
				.setDescription('Number of pp to bet!')
				.setRequired(true)),
	admin: false,
    cooldown: 900,
	execute(interaction) {
        let bet_amt = parseInt(interaction.options._hoistedOptions[0].value);
        let slot1 = weighted_random(slotChance);
        let slot3 = weighted_random(slotChance);
        let slot2 = weighted_random(slotChance);
        let winnings = bet_amt;
        let bonus_display = 'x0';
        let final_message = 'None';

        let slot_display = '<:rainbowwoke:850098513718018069> <:rainbowwoke:850098513718018069> <:rainbowwoke:850098513718018069> x20\n' +
        '<:botwoke:916344676066398238> <:botwoke:916344676066398238> <:botwoke:916344676066398238> x15\n' + 
        '<:botcatpink:790994230029844481> <:botcatpink:790994230029844481> <:botcatpink:790994230029844481> x10\n' +
        '<:botjeff:831572962833727558> <:botjeff:831572962833727558> <:botjeff:831572962833727558> x10\n' +
        '<:botgrin:788062334425497601> <:botgrin:788062334425497601> <:botgrin:788062334425497601> x5\n' +
        '<:botslime:916344571053637632> <:botslime:916344571053637632> <:botslime:916344571053637632> x5\n' +
        '<:rainbowwoke:850098513718018069> <:rainbowwoke:850098513718018069> x4 (any pair of 2)\n' +
        '<:rainbowwoke:850098513718018069> x2\n' + 
        '<:botno:773619578336837644> x0\n' +
        '<:botno:773619578336837644> <:botno:773619578336837644> <:botno:773619578336837644> x-5\n' +
        '------------------------------------------------------\n' +
        `You bet **${bet_amt}** <:pp:772971222119612416>`;

        if (bet_amt > 250) {
            bet_amt = 250;
        }

        if (bet_amt > db.balances.get(interaction.user.id)) {
            bet_amt = db.balances.get(interaction.user.id);
        }
        
        if (bet_amt < 0) {
            return interaction.editReply(`You doofus you can't bet negative money are you TRYING TO SCAM THIS GOOD PINAPL CASINO, I WILL HAVE YOU THROWN OUT FOR YOUR CRIMES`);
        }

        // Stats Update
        db.profile.math(interaction.user.id, '+', 1, 'casino.games_played');
        db.profile.math(interaction.user.id, '+', 1, 'slots.games_played');

        // Slot Machine Math
        db.balances.math(interaction.user.id, '-', bet_amt);

        if ([slot1, slot2, slot3].filter(slot => slot === '<:botno:773619578336837644>').length === 1 || [slot1, slot2, slot3].filter(slot => slot === '<:botno:773619578336837644>').length === 2) {
            bonus_display = '<:botno:773619578336837644> (x0)';
            winnings = bet_amt * 0;
            final_message = `In this case, it seems ❌ doesn't mark the spot...\nI'm sorry... You lose what you put in and gain nothing.`;

            db.profile.math(interaction.user.id, '+', bet_amt, 'slots.pp_lost');
            db.profile.math(interaction.user.id, '+', bet_amt, 'casino.pp_lost');
            db.profile.math(interaction.user.id, '+', 1, 'slots.negative');

        } else if ([slot1, slot2, slot3].filter(slot => slot === '<:botno:773619578336837644>').length === 3) {
            bonus_display = '<:botno:773619578336837644> <:botno:773619578336837644> <:botno:773619578336837644> (x-5)';
            if (!db.profile.get(interaction.user.id, 'items').includes('clover')) {
                final_message = `YOU HAVE ANGERED THE CASINO GODS WITH YOUR 3 ❌s, YOUR MONEY IS NOW FORFEIT.\nBummer! You lose 5x what you put in!`;
                winnings = bet_amt * 5;

                db.profile.math(interaction.user.id, '+', winnings, 'slots.pp_lost');
                db.profile.math(interaction.user.id, '+', winnings, 'casino.pp_lost');
                db.balances.math(interaction.user.id, '-', winnings);
            } else {
                final_message = `YOU HAVE ANGERED THE CASINO GODS WITH YOUR 3 ❌s, YOUR MONEY IS NOW FORFEIT.\nYou quickly brandish your clover, and negate the forfeit money!\nYou only lose what you bet!`;

                db.profile.math(interaction.user.id, '+', bet_amt, 'slots.pp_lost');
                db.profile.math(interaction.user.id, '+', bet_amt, 'casino.pp_lost');
            }

            db.profile.math(interaction.user.id, '+', 1, 'slots.adios');


        } else if (slot1 === '<:rainbowwoke:850098513718018069>' && slot2 === '<:rainbowwoke:850098513718018069>' && slot3 === '<:rainbowwoke:850098513718018069>') {
            bonus_display = '<:rainbowwoke:850098513718018069> <:rainbowwoke:850098513718018069> <:rainbowwoke:850098513718018069> (x20)';
            winnings = bet_amt * 20;
            final_message = `You won the BIG BOY BOT JACKBOT!!!!!!\nCONGRATS!!! YOU GAIN 20x WHAT YOU PUT IN AND GAIN **${winnings}** <:pp:772971222119612416>!!!\nWOW!!!!!`;
            db.balances.math(interaction.user.id, '+', winnings);

            db.profile.math(interaction.user.id, '+', winnings, 'slots.pp_won');
            db.profile.math(interaction.user.id, '+', winnings, 'casino.pp_won');
            db.profile.math(interaction.user.id, '+', 1, 'slots.jackpot');

        } else if (slot1 === '<:botwoke:916344676066398238>' && slot2 === '<:botwoke:916344676066398238>' && slot3 === '<:botwoke:916344676066398238>') {
            bonus_display = '<:botwoke:916344676066398238> <:botwoke:916344676066398238> <:botwoke:916344676066398238> (x15)';
            winnings = bet_amt * 15;
            final_message = `Close... but still very commendable.\nCongrats! You gain 15x what you put in and get **${winnings}** <:pp:772971222119612416>!`;
            db.balances.math(interaction.user.id, '+', winnings);

            db.profile.math(interaction.user.id, '+', winnings, 'slots.pp_won');
            db.profile.math(interaction.user.id, '+', winnings, 'casino.pp_won');
            db.profile.math(interaction.user.id, '+', 1, 'slots.positive');

        } else if (slot1 === '<:botcatpink:790994230029844481>' && slot2 === '<:botcatpink:790994230029844481>' && slot3 === '<:botcatpink:790994230029844481>') {
            bonus_display = '<:botcatpink:790994230029844481> <:botcatpink:790994230029844481> <:botcatpink:790994230029844481> (x10)';
            winnings = bet_amt * 10;
            final_message = `Meeeeow!\nCongrats!You gain 10x what you put in and get **${winnings}** <:pp:772971222119612416>!`;
            db.balances.math(interaction.user.id, '+', winnings);

            db.profile.math(interaction.user.id, '+', winnings, 'slots.pp_won');
            db.profile.math(interaction.user.id, '+', winnings, 'casino.pp_won');
            db.profile.math(interaction.user.id, '+', 1, 'slots.positive');

        } else if (slot1 === '<:botjeff:831572962833727558>' && slot2 === '<:botjeff:831572962833727558>' && slot3 === '<:botjeff:831572962833727558>') {
            bonus_display = '<:botjeff:831572962833727558> <:botjeff:831572962833727558> <:botjeff:831572962833727558> (x10)';
            winnings = bet_amt * 10;
            final_message = `Ayo its Jeff, nice win lol.\nCongrats! You gain 10x what you put in and get **${winnings}** <:pp:772971222119612416>!`;
            db.balances.math(interaction.user.id, '+', winnings);

            db.profile.math(interaction.user.id, '+', winnings, 'slots.pp_won');
            db.profile.math(interaction.user.id, '+', winnings, 'casino.pp_won');
            db.profile.math(interaction.user.id, '+', 1, 'slots.positive');

        } else if (slot1 === '<:botgrin:788062334425497601>' && slot2 === '<:botgrin:788062334425497601>' && slot3 === '<:botgrin:788062334425497601>') {
            bonus_display = '<:botgrin:788062334425497601> <:botgrin:788062334425497601> <:botgrin:788062334425497601> (x5)';
            winnings = bet_amt * 5;
            final_message = `:))))\nCongrats! You gain 5x what you put in and get **${winnings}** <:pp:772971222119612416>!`;
            db.balances.math(interaction.user.id, '+', winnings);

            db.profile.math(interaction.user.id, '+', winnings, 'slots.pp_won');
            db.profile.math(interaction.user.id, '+', winnings, 'casino.pp_won');
            db.profile.math(interaction.user.id, '+', 1, 'slots.positive');

        } else if (slot1 === '<:botslime:916344571053637632>' && slot2 === '<:botslime:916344571053637632>' && slot3 === '<:botslime:916344571053637632>') {
            bonus_display = '<:botslime:916344571053637632> <:botslime:916344571053637632> <:botslime:916344571053637632> (x5)';
            winnings = bet_amt * 5;
            final_message = `A little slimey, but a wins a win!\nCongrats! You gain 5x what you put in and get **${winnings}** <:pp:772971222119612416>!`;
            db.balances.math(interaction.user.id, '+', winnings);

            db.profile.math(interaction.user.id, '+', winnings, 'slots.pp_won');
            db.profile.math(interaction.user.id, '+', winnings, 'casino.pp_won');
            db.profile.math(interaction.user.id, '+', 1, 'slots.positive');

        } else if ([slot1, slot2, slot3].filter(slot => slot === '<:rainbowwoke:850098513718018069>').length === 2) {
            bonus_display = '<:rainbowwoke:850098513718018069> <:rainbowwoke:850098513718018069> (x4)';
            winnings = bet_amt * 4;
            final_message = `Ever so close, yet ever so far...\nCongrats! You gain 4x what you put in and get **${winnings}** <:pp:772971222119612416>!`;
            db.balances.math(interaction.user.id, '+', winnings);

            db.profile.math(interaction.user.id, '+', winnings, 'slots.pp_won');
            db.profile.math(interaction.user.id, '+', winnings, 'casino.pp_won');
            db.profile.math(interaction.user.id, '+', 1, 'slots.positive');

        } else if ([slot1, slot2, slot3].filter(slot => slot === '<:rainbowwoke:850098513718018069>').length === 1) {
            bonus_display = '<:rainbowwoke:850098513718018069> (x2)';
            winnings = bet_amt * 2;
            final_message = `You found one of the rainbow ones, incredible!\nCongrats! You gain 2x what you put in and get **${winnings}** <:pp:772971222119612416>!`;
            db.balances.math(interaction.user.id, '+', winnings);

            db.profile.math(interaction.user.id, '+', winnings, 'slots.pp_won');
            db.profile.math(interaction.user.id, '+', winnings, 'casino.pp_won');
            db.profile.math(interaction.user.id, '+', 1, 'slots.positive');

        } else {
            bonus_display = 'Nothing!';
            final_message = `Nothing really comes out of this. You get some of your money back, but some of it is sucked into the void....`;
            db.balances.math(interaction.user.id, '+', bet_amt - Math.round(bet_amt / 4));

            db.profile.math(interaction.user.id, '+', Math.round(bet_amt / 4), 'slots.pp_lost');
            db.profile.math(interaction.user.id, '+', Math.round(bet_amt / 4), 'casino.pp_lost');
            db.profile.math(interaction.user.id, '+', 1, 'slots.neutral');

        }

        const betEmbed = new Discord.MessageEmbed()

        .setColor('#ffff00')
        .setTitle(`<:botrng:831955715803316339> Pinapl's Casino <:botrng:831955715803316339>`)
        .setDescription(slot_display)
        .addField(`The bot machine returns`, `| ${slot1} | ${slot2} | ${slot3} |`)
        .addField(`Bonuses:`, `${bonus_display}\n${final_message}`)
        .setFooter(`You can bet again in 15 minutes. The max you can bet is 250pp.`);

        interaction.editReply({ embeds: [betEmbed] });
	},
};
