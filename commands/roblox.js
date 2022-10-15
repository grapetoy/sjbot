const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, inlineCode } = require('discord.js')
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roblox')
        .setDescription('로블록스 유저 조회')
        .addStringOption(option => option.setName('username').setDescription('사용자 실제 닉네임').setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.getString('username');
        axios.get(`https://api.roblox.com/users/get-by-username?username=${username}`)
            .then(function(response) {
                if (response.data.success === undefined) {
                    let avatarUrl
                    const userId = response.data.Id
                    axios.get(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=720x720&format=png`)
                        .then(function(response) {
                            avatarUrl = response.data.data.at(-1).imageUrl
                            console.log(avatarUrl)
                        })
                    console.log("있음")
                    axios.get(`https://users.roblox.com/v1/users/${userId}`)
                        .then(function(response) {
                            let description
                            if (response.data.description == "") {
                                description = "(사용자의 상태메세지(설명)이 없습니다.)"
                            }
                            else {
                                description = response.data.description
                            }
                            if (response.data.isBanned == true) {
                                console.log(avatarUrl)
                                const resultEmbed = new EmbedBuilder()
                                    .setColor([255, 0, 0])
                                    .setTitle("로블록스 유저 조회 : 성공")
                                    .setDescription(`:no_entry:로블록스에서 **밴**당한 유저입니다.\n${inlineCode(username)}이라는 이름으로 조회한 결과입니다.`)
                                    .setTimestamp()
                                    .setAuthor({ name: username, iconURL: `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=60&height=60&format=png`, url: `https://roblox.com/users/${userId}/profile` })
                                    .addFields(
                                        { name: '표시 닉네임', value: response.data.displayName },
                                        { name: '계정 생성 일자', value: response.data.created.slice(0, 10) + "  " + response.data.created.slice(11, 19) },
                                        { name: "상태 메세지(설명)", value: description },
                                    )
                                    .setImage(url = avatarUrl)
                                interaction.reply({ embeds: [resultEmbed] })
                            }
                            else {
                                console.log(avatarUrl)
                                const resultEmbed = new EmbedBuilder()
                                    .setColor([10, 255, 20])
                                    .setTitle("로블록스 유저 조회 : 성공")
                                    .setDescription(`${inlineCode(username)}이라는 이름으로 조회한 결과입니다.`)
                                    .setTimestamp()
                                    .setAuthor({ name: username, iconURL: `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=60&height=60&format=png`, url: `https://roblox.com/users/${userId}/profile` })
                                    .addFields(
                                        { name: '표시 닉네임', value: response.data.displayName },
                                        { name: '계정 생성 일자', value: response.data.created.slice(0, 10) + "  " + response.data.created.slice(11, 19) },
                                        { name: "상태 메세지(설명)", value: description }
                                    )
                                    .setImage(url = avatarUrl)
                                interaction.reply({ embeds: [resultEmbed] })
                            }

                        })
                }
                else {
                    console.log("없음")
                    const invalidUserEmbed = new EmbedBuilder()
                        .setColor([245, 252, 33])
                        .setTitle("로블록스 유저 조회 : 실패")
                        .setDescription(`:face_with_monocle:음...${inlineCode(username)}라는 이름을 가진 유저는 없는 거 같아요\n표시 닉네임이 아닌 __실제 닉네임__으로 시도해보세요`)
                        .setTimestamp()
                    interaction.reply({ embeds: [invalidUserEmbed] })
                }
            })
            .catch(function(error) {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setColor([227, 47, 34])
                    .setTitle("로블록스 유저 조회 : 실패")
                    .setDescription(":tired_face:알 수 없는 오류가 발생했어요.\n로블록스 서버나,제가 맛탱이가 가면(또는 한꺼번에 너무 많은 요청을 보내면) 이런 경우도 있으니 다시 시도해보세요!")
                interaction.reply({ embeds: [errorEmbed] })
            })

    },
};