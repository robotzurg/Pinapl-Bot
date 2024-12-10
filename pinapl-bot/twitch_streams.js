const { Permissions, EmbedBuilder } = require("discord.js");
const { AppTokenAuthProvider } = require("@twurple/auth");
const { ApiClient } = require("@twurple/api");
const db = require('./db.js');
require("dotenv").config();

const refreshMin = 1;

const clientID = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const authProvider = new AppTokenAuthProvider(clientID, clientSecret);
const client = new ApiClient({ authProvider });

async function getGameID(name) {
    const game = await client.games.getGameByName(name);
    return game.id;
}

async function getStreamsForGame(gameid, opts = { game: gameid, limit: 100 }, result = { streams: [] }) {
    const streams = await client.streams.getStreams(opts);
    result = { game: gameid, streams: streams.data }
    if (streams.data.length === 100) {
        const res = await getStreamsForGame(gameid, {
            after: streams.cursor,
            game: gameid,
            limit: 100
        }, result);
        return {
            game: gameid,
            streams: [...result.streams, ...res.streams]
        };
    } else {
        return result;
    }
}

async function getAllUsers(streams) {
    let users = streams.map(stream => client.users.getUserById(stream.userId));
    users = await Promise.all(users);
    return users;
}

function saveToEnmap(arr, guildID) {
    db.stream_list.set(guildID, arr);
}

async function removeClosedStreams(streamIDs, closedStreams, chan) {
    for (let i = streamIDs.length - 1; i >= 0; i--) {
        if (closedStreams.includes(streamIDs[i])) {
            let m;
            try {
                m = await chan.messages.fetch(streamIDs[i].msgID);
            } catch (e) {
                console.log("* Couldn't fetch message - Removing from list.");
            }
            if (m) {
                try {
                    await m.delete();
                } catch (e) {
                    console.error(`Could not delete message with ID ${m.id}`);
                }
            }
            streamIDs.splice(i, 1);
        }
    }
    return streamIDs;
}

async function sendManager(streams, users, chan, gameUrl) {
    let streamIDs = db.stream_list.get(chan.guild.id) || [];
    const totalStreams = streams.length;
    let amntSent = 0;

    for (const stream of streams) {
        const user = users.find(u => u.id === stream.userId);
        const d = new Date(stream.startDate);
        const now = new Date();
        const hrs = Math.floor((((now - d) / 1000) / 60) / 60);
        const min = Math.floor(((now - d - (hrs * 60 * 60 * 1000)) / 1000) / 60);
        const uptime = `${hrs.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

        const embed = new EmbedBuilder()
            .setDescription(stream.title)
            .setColor([100, 60, 160])
            .setAuthor({
                name: stream.userDisplayName,
                iconURL: user.profilePictureUrl,
                url: `https://twitch.tv/${user.name}`
            })
            .setTimestamp(d)
            .setFooter({
                text: "Started",
                iconURL: "https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png"
            })
            .setURL(`https://twitch.tv/${user.name}`)
            .addFields([
                { name: "Viewers", value: stream.viewers.toString(), inline: true },
                { name: "Uptime", value: uptime, inline: true },
                { name: "URL", value: `[ttv/${user.name}](https://twitch.tv/${user.name})`, inline: true },
            ])

        const img = `${stream.thumbnailUrl.replace("{width}", "880").replace("{height}", "496")}?${Date.now()}`;
        if (streams.length > 1) {
            embed.setThumbnail(img);
        } else {
            embed.setImage(img);
        }

        if (!streamIDs.some(s => s.streamID === stream.id)) {
            const m = await chan.send({ content: "New Alnico Smithery Stream!\nGo check it out!", embeds: [embed] });
            streamIDs.push({ streamID: stream.id, msgID: m.id });
            amntSent++;
        }
    }

    const closedStreams = streamIDs.filter(sid => !streams.some(s => s.id === sid.streamID));
    const newStreamIDs = await removeClosedStreams(streamIDs, closedStreams, chan);
    saveToEnmap(newStreamIDs, chan.guild.id);

    if (amntSent > 0 || closedStreams.length > 0) {
        chan.setTopic(`${gameUrl} \n- Streams: ${totalStreams}`);
    }
}

function main(bot, chan, guild, gameName) {
    const gameUrl = `https://twitch.tv/directory/game/${encodeURIComponent(gameName)}`;
    console.log('Checking Streams...');
    getGameID(gameName)
        .then(getStreamsForGame)
        .then(data => {
            getAllUsers(data.streams).then(users => {
                sendManager(data.streams, users, chan, gameUrl).then(() => {
                    setTimeout(() => {
                        streams(bot, guild);
                    }, refreshMin * 60 * 1000);
                });
            });
        })
        .catch(err => {
            console.error(`Failed to check Twitch streams: ${err}`);
        });
}

function streams(bot, guild) {
    const chan = guild.channels.cache.get('814629332860534805');
    if (chan) {
        main(bot, chan, guild, 'Alnico Smithery');
    }
}

module.exports = streams;
