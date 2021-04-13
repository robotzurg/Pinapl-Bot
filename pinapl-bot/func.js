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
    
};