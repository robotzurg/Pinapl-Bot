const Discord = require('discord.js');

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
};