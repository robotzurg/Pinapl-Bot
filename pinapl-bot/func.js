const Discord = require('discord.js');
const db = require('./db.js');

module.exports = {
    test: function() {
        console.log('Test');
    },

    // The main reason this function exists is to provide a easier in-code solution for error handling Unknown Message errors.
    msg_delete_timeout: function(msg, dur, content = false) {
        if (content === false) {
            msg.delete({ timeout: dur }).catch(error => {
                if (error.code !== Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                    console.error('Failed to delete the message:', error);
                }
            });
        } else {
            msg.channel.send(content).then(m => {
                m.delete({ timeout: dur }).catch(error => {
                    if (error.code !== Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
                        console.error('Failed to delete the message:', error);
                    }
                });
            });
        }
    },

    arrayRemove: function(arr, value) { 
        return arr.filter(function(ele) { 
            return ele != value; 
        });
    },

    randomNumber: function(min, max) { 
        return Math.random() * (max - min) + min; 
    },

    capitalize: function(string) { 
        string = string.split(' ');
        string = string.map(a => a.charAt(0).toUpperCase() + a.slice(1));
        string = string.join(' ');
        return string;
    },
    
    add_role: function(msg, user, role_id) {
        console.log('test');
        const added_role = msg.guild.roles.cache.find(role => role.id === role_id);
        msg.guild.members.fetch(user).then(a => a.roles.add(added_role));
    },

    remove_role: function(msg, user, role_id) {
        const removed_role = msg.guild.roles.cache.find(role => role.id === role_id);
        msg.guild.members.fetch(user).then(a => a.roles.remove(removed_role));
    },

    add_or_remove_role: function(msg, user, role_id) {
        const role = msg.guild.roles.cache.find(role_ => role_.id === role_id);
        msg.guild.members.fetch(user).then(role_user => {
            if (role_user._roles.includes(role_id)) {
                role_user.roles.remove(role);
            } else {
                role_user.roles.add(role);
            }
        });
    },

    weighted_random: function(options) {
        let i;
    
        let weights = [];
    
        for (i = 0; i < options.length; i++) {
            weights[i] = options[i].weight + (weights[i - 1] || 0);
        }
        
        let random = Math.random() * weights[weights.length - 1];
        
        for (i = 0; i < weights.length; i++) {
            if (weights[i] > random) {
                break;
            }
        }
    
        return options[i].item;
    },

    updateGameStatus: function(interaction) {
        const channeltoSearch = interaction.guild.channels.cache.get('834092525354352670');
        const statusPanel = new Discord.MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('Current Status of the Game')
        .setDescription(`**Game Status:** ${db.stats.get('Game Status')}\n**Day:** ${db.stats.get('Day')}\n**In-Game Time:** ${db.stats.get('Time')}\n` + 
        `**Players Left:** ${db.stats.get('Players Left')}`);        

        (channeltoSearch.messages.fetch('834097043726532659')).then((msg) => {
            msg.edit(statusPanel);
        });
    },

    updateUserStatus: function(interaction) {
        const channeltoSearch = interaction.guild.channels.cache.get('834092525354352670');
        const alivePanel = new Discord.MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('Current Status of the Players in the Game');

        let playerList = db.tributes.keyArray();
        playerList = playerList.filter(s => s !== 'Alive' && s !== 'Dead');
        playerList = playerList.map(tribute => `<@${tribute}>\n**Status:** ${db.tributes.get(tribute, 'status')}` + 
        `\n**HP:** ${db.tributes.get(tribute, 'health')}\n**Action?:** ${db.tributes.get(tribute, 'action')}\n**Kills:** ${db.tributes.get(tribute, 'kill_num')}\n` +
	`**INV:** ${db.tributes.get(tribute, 'inventory').length}\n`);
        alivePanel.setDescription(playerList);

        (channeltoSearch.messages.fetch('834097044175847485')).then((msg) => {
            msg.edit(alivePanel);
        });
    },

    updateSponsorList: function(interaction) {
        const channeltoSearch = interaction.guild.channels.cache.get('834092525354352670'); 
        const sponsorPanel = new Discord.MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('Current list of sponsors')
        .setDescription(`**Daily:**\n${db.priority_airdrop.keyArray().join('\n')}\n**Cornucopia:**\n${db.airdrop.keyArray().join('\n')}`);

        (channeltoSearch.messages.fetch('834097045156528228')).then((msg) => {
            msg.edit(sponsorPanel);
        });
    },

    getTimeDif: function(startTime, endTime) {
		return (endTime.getTime() - startTime.getTime());   
    },

    dateToCron: function(date) {
        const seconds = date.getSeconds();
        const minutes = date.getMinutes();
        const hours = date.getHours();
        const days = date.getDate();
        const months = date.getMonth() + 1;
        const dayOfWeek = date.getDay();
    
        return `${seconds} ${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
    },
    
};