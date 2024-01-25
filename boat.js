// JS file used for 2023 BOAT. No longer in use, but kept for reference.

const Discord = require('discord.js');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions]
});
const prefix = "n?";

const dotenv = require('dotenv');
dotenv.config();
const Token = process.env.DISCORD_TOKEN;
const spreadsheetAPIKey = process.env.SPREADSHEET_APIKEY;

//Load spreadsheet
const { JWT } = require('google-auth-library');
const { GoogleSpreadsheet } = require("google-spreadsheet");
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];
const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: SCOPES,
});

const doc = new GoogleSpreadsheet('1uZzD5eafjzjccRwR_Hk0EOeBSpY4Sbikpmj1pEbbFWY', jwt);
var BOAT2023Sheet;
async function loadDoc() {
    await doc.loadInfo();
    console.log(`Loaded doc ${doc.title}!`);
    BOAT2023Sheet = doc.sheetsById['656348782'];
    console.log(`Loaded sheet ${BOAT2023Sheet.title}!`)
}
loadDoc();

client.once(Events.ClientReady, () => {
    console.log(`Bot is now online!`);
});

Array.prototype.myJoin = function (seperator, start, end) {
    if (!start) start = 0;
    if (!end) end = this.length - 1;
    end++;
    return this.slice(start, end).join(seperator);
};

client.on(Events.MessageCreate, async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const BoatChannel = client.channels.cache.get('1074524369918894111'); //actual channel
    //const BoatChannel = client.channels.cache.get('1185440485343510679'); //testing channel
    const ResultsChannel = client.channels.cache.get('1093917276878671925'); //actual channel
    //const ResultsChannel = client.channels.cache.get('1185440485343510679'); //testing channel
    switch (command) {
        case "boat":
            if (message.member.roles.cache.has("1074521629994004521")) {
                if (!args.length) {
                    message.react('⚠️');
                    message.reply("Please provide a song title.");
                } else {
                    const ArgJoin = args.myJoin(" ", 0);
                    message.react('💬');
                    BoatChannel.send(`${ArgJoin}`).then(msg => {
                        msg.react('😍').then(() => {
                            msg.react('👍').then(() => {
                                msg.react('🤷').then(() => {
                                    msg.react('👎').then(() => {
                                        msg.react('🤢').then(() => {
                                            message.react('✅')
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
            } else {
                message.react('❌');
                message.reply(`You don't have permission to run that command!`);
            }
            break;

        /* Disabled for now

        case "search":
            if (!args.length) {
                message.react('❌');
                message.reply('Please provide a number.');
            } else {
                message.react('📡');
                var rowsLength;
                async function CheckRows() {
                    doc.useApiKey(spreadsheetAPIKey);
                    await doc.loadInfo();
                    var sheet = doc.sheetsByIndex[0];
                    var rows = await sheet.getRows();
                    rowsLength = rows.length;
                }
                CheckRows().then(() => {
                    var FirstArg = parseInt(args[0]);
                    if (FirstArg > rowsLength) {
                        message.react('⚠️');
                        message.reply(`Please choose a lower number. There are currently only \`${rowsLength}\` songs in the boat.`);

                    } else if (FirstArg <= rowsLength) {
                        async function SearchByPlacement() {
                            doc.useApiKey(spreadsheetAPIKey);
                            await doc.loadInfo();
                            var sheet = doc.sheetsByIndex[0];
                            var rows = await sheet.getRows();
                            var Artist = await rows[FirstArg]['Artist(s)'];
                            var SName = await rows[FirstArg]['Song Name'];
                            var Genre = await rows[FirstArg].Genre;
                            var Rating = await rows[FirstArg].Rating;
                            const Song1Embed = new Discord.MessageEmbed()
                                .setTitle(`${SName} (#${FirstArg})`)
                                .addFields(
                                    { name: 'Artist(s)', value: `${Artist}`, inline: true },
                                    { name: 'Genre', value: `${Genre}`, inline: true },
                                    { name: 'Rating', value: `${Rating}`, inline: true },
                                )
                                .setColor('#bcf1f1')
                                .setTimestamp(message.createdTimestamp);
                            message.reply({ embeds: [Song1Embed] });
                            message.react('✅');
                        }
                        SearchByPlacement();
                    } else {
                        message.react('⚠️');
                        message.reply('Please provide a number.');
                    }
                });
            }
            break;*/

        case "title": //For 2023, this will use the date range of the prior week. For 2024, it will be the current day.
            if (message.member.roles.cache.has("1074521629994004521")) {
                message.react('💬');
                const d = new Date();
                BoatChannel.send(`**${new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7).toLocaleDateString('en-us')} - ${new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1).toLocaleDateString('en-us')}**\n\n😍 +2 points\n👍  +1 points\n🤷 0 points\n👎 -1 points\n🤢 -2 points`);
                message.react('✅');
            } else {
                message.react('❌');
                message.reply(`You don't have permission to run that command!`);
            }
            break;

        case "announce": //You know the drill, this will be different for 2024.
            if (message.member.roles.cache.has("1074521629994004521")) {
                message.react('💬');
                const d = new Date();
                BoatChannel.send(`Voting for this week ends <t:${Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 35).getTime() / 1000)}:R>!\n\n<@&1074521691222454374>`);
                message.react('✅');
            } else {
                message.react('❌');
                message.reply(`You don't have permission to run that command!`);
            }
            break;

        case "update":
            if (message.member.roles.cache.has("1074521629994004521")) {
                message.react('💬');
                var rowCount = await BOAT2023Sheet.rowCount;
                for (msgID of args) {
                    await BoatChannel.messages.fetch(msgID)
                    .then(async BoatMsg => {
                        var BoatMsgReactions = await BoatMsg.reactions.cache;
                        if (BoatMsgReactions.has('✅')) {
                            await message.reply(`Message with ID ${msgID} has already been updated!`);
                        }
                        else {
                            rowCount++;
                            await BOAT2023Sheet.addRow([
                                `=ROW(A${rowCount})-1`,
                                `${BoatMsg.content.split(' - ').slice(0,-1).join(' - ')}`, //this was coded to deal with Mista - T - Illusions
                                `${BoatMsg.content.split(' - ').slice(-1)}`,
                                ``,
                                `=CEILING.MATH(N${rowCount},0.001)`,
                                `${BoatMsgReactions.get('😍').count-1}`,
                                `${BoatMsgReactions.get('👍').count-1}`,
                                `${BoatMsgReactions.get('🤷').count-1}`,
                                `${BoatMsgReactions.get('👎').count-1}`,
                                `${BoatMsgReactions.get('🤢').count-1}`,
                                `=((F${rowCount}*2)+(G${rowCount})+(I${rowCount}*-1)+(J${rowCount}*-2))`,
                                `=SUM(F${rowCount}:J${rowCount})`,
                                `=K${rowCount}/L${rowCount}`,
                                `=(M${rowCount}+2)/4`
                            ]
                            , {raw: false, insert: true});
                            await BoatMsg.react('✅');
                        }
                    })
                    .catch(async error => {
                        await message.reply(`Couldn't find message with ID ${msgID}!`);
                    });
                }
                message.react('✅');
            } else {
                message.react('❌');
                message.reply(`You don't have permission to run that command!`);
            }
            break;
        
        case "results":            
            if (message.member.roles.cache.has("1074521629994004521")) {
                message.react('💬');
                ResultsChannel.send(`**BOAT 2023 Results**\n`);
                var rows = await BOAT2023Sheet.getRows();
                var i = 0;
                var interval = setInterval(async function() {
                    await ResultsChannel.send(`**${i+1}\t${rows[i].get('Artist(s)')} - ${rows[i].get('Song Name')}** *(${rows[i].get('Rating')})*`);
                    i++;
                    if (i >= rows.length) clearInterval(interval);
                }, 1000);
                message.react('✅');
            } else {
                message.react('❌');
                message.reply(`You don't have permission to run that command!`);
            }
            break;
        
        default:
            message.react('❌');
            message.reply(`That command doesn't exist!`);
            break;
    }
});
client.login(Token);