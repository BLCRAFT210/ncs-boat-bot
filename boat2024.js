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
var BOAT2024Sheet;
async function loadDoc() {
    await doc.loadInfo();
    console.log(`Loaded doc ${doc.title}!`);
    BOAT2024Sheet = doc.sheetsById['245152338'];
    console.log(`Loaded sheet ${BOAT2024Sheet.title}!`)
}
loadDoc();

const bannedUsers = ['1168649458058268814','873678656814317588','1135715220027883641'];

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
                    BoatChannel.send(`Voting for this day ends <t:${Math.floor(new Date(2024, d[0]-1, d[1]).getTime() / 1000)}:R>!\n\n<@&1074521691222454374>`);
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
                        var BoatMsgReactions = BoatMsg.reactions.cache;

                        // BoatMsgReactions.users.fetch()
                        if (BoatMsgReactions.has('✅')) {
                            await message.reply(`Message with ID ${msgID} has already been updated!`);
                        } else {
                            // Check for voter fraud
                            const rxns = ['😍','👍','🤷','👎','🤢']
                            const rxnUsers = await Promise.all(rxns.map(async (rxn) => BoatMsgReactions.get(rxn).users.fetch()))
                            const userIdToUsers = {}
                            rxnUsers.forEach((users) => {
                                for(let u of users.values()){
                                    userIdToUsers[u.id] = u
                                }
                            })

                            const rxnUserIds = rxnUsers.map((users) => Array.from(users.keys()))
                            const userIdToRxns = {}
                            rxnUserIds.forEach((ids, i) => {
                                ids.forEach((id) => {
                                    if(!userIdToRxns[id]){
                                        userIdToRxns[id] = []
                                    }
                                    userIdToRxns[id].push(rxns[i])
                                })
                            })
                            const rxnVotes = rxns.map((rxn, i) => rxnUserIds[i].filter(id => !bannedUsers.includes(id) && userIdToRxns[id].length <= 1).length)
                            const violators = Object.values(userIdToUsers).filter(u => userIdToRxns[u.id].length > 1 && u.globalName)
                            
                            if(violators.length > 0){
                                const violatorMsg = violators.map(vio => `${vio.username} (${vio.id})`).join('\n')
                                await message.reply(`⚠️ **The following users have voted multiple times:**\n${violatorMsg}`)
                            }

                            var controversyTotal = 0;
                            var controversyCount = 0;
                            for (let i=0; i<rxnVotes.length; i++) {
                                for (let j=i; j<rxnVotes.length; j++) {
                                    controversyTotal += (rxnVotes[i]*rxnVotes[j])*(j-i);
                                    controversyCount += rxnVotes[i]*rxnVotes[j];
                                }
                            }
                            
                            // Update sheet
                            rowCount++;
                            await BOAT2024Sheet.addRow([
                                `=ROW(A${rowCount})-1`,
                                `${BoatMsg.content.split(' - ').slice(0,-1).join(' - ')}`, //artists, this was coded to deal with Mista - T - Illusions
                                `${BoatMsg.content.split(' - ').at(-1).split(' *(')[0]}`, //track
                                `?`, //genre
                                `${BoatMsg.content.split(' - ').at(-1).split(' *(')[1].substring(0,4)}-${args[0].replace('/','-')}`, //date
                                `?`, //brand
                                `=(N${rowCount}+2)/4`, //percent
                                ...rxnVotes.map(v => `${v}`),
                                `=SUM(H${rowCount}:L${rowCount})`, //voters
                                `=(2*H${rowCount}+I${rowCount}-K${rowCount}-2*L${rowCount})/M${rowCount}`, //score
                                `${(controversyTotal/controversyCount).toFixed(7)}` //controversy
                            ]
                            , {raw: false, insert: true});
                            // id, name, +2, +1,.. -2, Song 1, Song 2 ... 
                            // .id, .name, SUMIF(Song1Colum:SongNColum, If == 'heart'), ..., -2, Song1 Reaction, 
                            await BoatMsg.react('✅');
                        }
                    })
                    .catch(async error => {
                        console.log(error);
                        await message.reply(`Couldn't find message with ID ${msgID}!`);
                    });
                }
                message.react('✅');
            } else {
                message.react('❌');
                message.reply(`You don't have permission to run that command!`);
            }
            break;
        
        case "edit": // edit a Discord message from the bot
            if (message.member.roles.cache.has("1074521629994004521")) {
                if (args.length < 2)
                {
                    message.react('⚠️');
                    message.reply("Please provide a message ID and a new message.");
                } else {
                    message.react('💬');
                    await BoatChannel.messages.fetch(args[0])
                    .then(async BoatMsg => {
                        const ArgJoin = args.myJoin(" ", 1);
                        await BoatMsg.edit(ArgJoin);
                        await message.react('✅');
                    })
                    .catch(async error => {
                        console.log(error);
                        await message.reply(`Couldn't find message with ID ${args[0]}!`);
                    });
                }
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