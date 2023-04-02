const Discord = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const prefix = "n?";

const dotenv = require('dotenv');
dotenv.config();
const Token = process.env.DISCORD_TOKEN;
const spreadsheetAPIKey = process.env.SPREADSHEET_APIKEY;

const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet('1uZzD5eafjzjccRwR_Hk0EOeBSpY4Sbikpmj1pEbbFWY');

client.once('ready', () => {
    console.log(`Bot is now online!`);
});

Array.prototype.myJoin = function (seperator, start, end) {
    if (!start) start = 0;
    if (!end) end = this.length - 1;
    end++;
    return this.slice(start, end).join(seperator);
};

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const BoatChannel = client.channels.cache.get('1074524369918894111'); // put the channel of where you want the boat to be posted here
    switch (command) {
        case "boat":
            if (message.member.roles.cache.has("1079163461176660119") || message.member.roles.cache.has("1074521629994004521")) {
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
            break;

        case "title": //For 2023, this will use the date range of the prior week. For 2024, it will be the current day.
            if (message.member.roles.cache.has("1079163461176660119") || message.member.roles.cache.has("1074521629994004521")) {
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
            if (message.member.roles.cache.has("1079163461176660119") || message.member.roles.cache.has("1074521629994004521")) {
                message.react('💬');
                const d = new Date();
                const monthnames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                BoatChannel.send(`Voting for this week ends <t:${Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 35).getTime() / 1000)}:R>!\n\n<@&1074521691222454374>`);
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