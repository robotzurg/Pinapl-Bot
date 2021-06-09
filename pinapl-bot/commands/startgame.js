const db = require("../db");
const { add_role, updateGameStatus, updateSponsorList, updateUserStatus } = require("../func");

module.exports = {
	name: 'startgame',
    description: 'Start a game of Pinapl Murder Royale.',
    options: [],
	admin: true,
	execute(interaction) {

	db.stats.set('Game Status', 'Corn Sponsors');
	updateGameStatus(interaction);

        let dateISO = new Date().toISOString();
		let dateISOsplit = dateISO.split('T');
		dateISOsplit[1] = '13:00:00.000Z';
		let dateISOsplit2 = dateISOsplit[0].split('-');
		dateISOsplit2[2] = parseInt(dateISOsplit2[2]);
		dateISOsplit2 = dateISOsplit2.join('-');
		dateISOsplit[0] = dateISOsplit2;
		dateISO = dateISOsplit.join('T');

        const filter = (reaction, user) => {
            return (reaction.emoji.name === '💀') && user.id != '818709319084015616';
        };

        console.log((new Date(dateISO).getTime() - Date.now()));

        interaction.channel.send('𝕿𝖍𝖊 𝕽𝖊𝖆𝖕𝖎𝖓𝖌 𝖍𝖆𝖘 𝖇𝖊𝖌𝖚𝖓!\n**All testers will be automatically entered into this game.**\n\n' + 
        'Don\'t forget you can sponsor items for the cornucopia in <#834091745909145610>! Just use `-sponsor <item>` to sponsor.').then(msg => {
            // msg.react('💀');
            msg.awaitReactions(filter, { time: new Date(dateISO).getTime() - Date.now(), errors: ['time'] })
            .catch(collected => {
                const users = [];
                const reaction = collected.first();
                console.log(reaction);
                let role = interaction.guild.roles.cache.find(role_ => role_.id === '833753177698467840');
                if(!role) interaction.reply('that role does not exist!');
                
                role.members.forEach(user => {
                    users.push(`<@${user.user.id}>`);
                    if (user.user.id != '818709319084015616') {
                        db.tributes.set(user.user.id, {
                            health: 4,
                            kill_num: 0,
                            in_corn: true,
                            action: false,
                            inventory: [],
                            status: "Alive",
                        });
                        db.tributes.push('Alive', user.user.id);
                        db.tributes.set('Dead', []);
                        db.stats.math('Players Left', '+', 1);
                        add_role(interaction, user.user.id, '771373653454880848');
                        updateGameStatus(interaction);
                        updateSponsorList(interaction);
                        updateUserStatus(interaction);
                    }
                });
        
                console.log(users);

                /*reaction.users.cache.forEach(function(val, key) {
                    users.push(`${key}`);
                    if (key != '818709319084015616') {
                        db.tributes.set(key, {
                            health: 4,
                            kill_num: 0,
                            in_corn: true,
                            action: false,
                            inventory: [],
                            status: "Alive",
                        });
                        db.tributes.push('Alive', key);
                        db.tributes.set('Dead', []);
                        db.stats.math('Players Left', '+', 1);
                        add_role(interaction, key, '771373653454880848');
                        updateGameStatus(interaction);
                        updateSponsorList(interaction);
                        updateUserStatus(interaction);
                    }
                });*/

                // users.shift();

                interaction.channel.send(`**𝕿𝖍𝖊 𝕽𝖊𝖆𝖕𝖎𝖓𝖌**\n\n${users.join('\n')}\n\n**The games will now begin!**\n`);
            });
        });
        db.stats.set('Game Status', 'Corn Sponsors');
	},
};