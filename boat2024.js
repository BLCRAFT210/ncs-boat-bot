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
const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet('1uZzD5eafjzjccRwR_Hk0EOeBSpY4Sbikpmj1pEbbFWY');
var BOAT2024Sheet;
async function loadDoc() {
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY
    });
    await doc.loadInfo();
    console.log(`Loaded doc ${doc.title}!`);
    BOAT2024Sheet = doc.sheetsById['245152338'];
    console.log(`Loaded sheet ${BOAT2024Sheet.title}!`)
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
    const BoatChannel = client.channels.cache.get('1074524369918894111');
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

        case "title":
            if (message.member.roles.cache.has("1074521629994004521")) {
                if (args.length != 1)
                {
                    message.react('⚠️');
                    message.reply("Please provide a date.");
                } else {
                    message.react('💬');
                    BoatChannel.send(`**${args[0]}**\n\n😍 +2 points\n👍  +1 points\n🤷 0 points\n👎 -1 points\n🤢 -2 points`);
                    message.react('✅');
                }
            } else {
                message.react('❌');
                message.reply(`You don't have permission to run that command!`);
            }
            break;

        case "announce":
            if (message.member.roles.cache.has("1074521629994004521")) {
                if (args.length != 1)
                {
                    message.react('⚠️');
                    message.reply("Please provide a date.");
                } else {
                    message.react('💬');
                    const d = args[0].split('/');
                    BoatChannel.send(`Voting for this day ends <t:${Math.floor(new Date(2023, d[0], d[1]).getTime() / 1000)}:R>!\n\n<@&1074521691222454374>`);
                    message.react('✅');
                }
            } else {
                message.react('❌');
                message.reply(`You don't have permission to run that command!`);
            }
            break;

        case "update":
            if (message.member.roles.cache.has("1074521629994004521")) {
                message.react('💬');
                var rowCount = await BOAT2024Sheet.rowCount;
                for (msgID of args.slice(1)) {
                    await BoatChannel.messages.fetch(msgID)
                    .then(async BoatMsg => {
                        var BoatMsgReactions = await BoatMsg.reactions.cache;
                        if (BoatMsgReactions.has('✅')) {
                            await message.reply(`Message with ID ${msgID} has already been updated!`);
                        }
                        else {
                            rowCount++;
                            await BOAT2024Sheet.addRow([
                                `=ROW(A${rowCount})-1`,
                                `${BoatMsg.content.split(' - ').slice(0,-1).join(' - ')}`, //artists, this was coded to deal with Mista - T - Illusions
                                `${BoatMsg.content.split(' - ')[-1].split(' (*')[0]}`, //track
                                ``, //genre
                                `${BoatMsg.content.split(' - ')[-1].split(' (*')[1].substring(0,4)}-${args[0].replace('/','-')}`, //date
                                ``, //brand
                                `=(2*H${rowCount}+I${rowCount}-K${rowCount}-2*L${rowCount})/M${rowCount}`, //score
                                `${BoatMsgReactions.get('😍').count-1}`,
                                `${BoatMsgReactions.get('👍').count-1}`,
                                `${BoatMsgReactions.get('🤷').count-1}`,
                                `${BoatMsgReactions.get('👎').count-1}`,
                                `${BoatMsgReactions.get('🤢').count-1}`,
                                `=SUM(H${rowCount}:L${rowCount})`, //voters
                                `=(H${rowCount}*(2-G${rowCount})^2+I${rowCount}*(1-G${rowCount})^2+J${rowCount}*(G${rowCount})^2+K${rowCount}*(-1-G${rowCount})^2+L${rowCount}*(-2-G${rowCount})^2)/M${rowCount}` //variance
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
        
        default:
            message.react('❌');
            message.reply(`That command doesn't exist!`);
            break;
    }
});
client.login(Token);