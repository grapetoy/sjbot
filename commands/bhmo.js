const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, inlineCode,ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const  axios  = require('axios');
const stringSimilarity = require("string-similarity");
const itemList = ["1년 개근 훈장","msg","MSG","가래떡","가죽","간장","감자 상자","감자","개근 훈장","계란 프라이","고구마 상자","고구마","고급 원석","고기구이","고목나무 수액","고엽","공구 상자","광장 입장권","광천수","구리","군고구마","규소","금","나무 도막","나무 지팡이","나무 회초리","나뭇가지","농축 비료","능력치 되돌리기 문서","능력치 초기화 문서","달걀","달고나","돈가스","된장","딸기 상자","딸기 잼","딸기","땅문서","떡국 고명","라면","마늘 상자","마늘","면포","모래","밀 상자","밀","밀짚모자","바위","반바지","반팔 티셔츠","백설기","버터","벼 상자","벼","벽돌","보석","비료","빛나는 하트","사과","사과나무 묘목","사리","사탕수수 상자","사탕수수","생고기","생크림 스콘","생크림","석탄","설탕","성냥","소금","소화기","솜","송진","송편","숯","스파게티","슬리퍼","시리얼","식빵","식용유","쌀밥","알리오 에 올리오","압착기","애호박","양파 상자","양파","양파즙","엄청 큰 떡국","영양제","영어 고수","영역 확장 문서(열)","영역 확장 문서(행)","예약된 공간","옥수수 상자","옥수수","우유","원석","유리","은","인싸","인터갤력틱 가스","인터갤럭틱 항아리","작물 교환권","작은 가방","재봉틀","정밀 기계","주간 퀘스트 선물 상자","지렁이","집적 회로","책가방","철","초","코코뱅","콩 상자","콩","크로뮴","타르트 타탱","탄산수소 나트륨","토마토 상자","토마토 소스","토마토","토스트","트랜지스터","파머모 입문 훈장","팝콘","팬케이크","포도","포도나무 묘목","포도주","하트 수집가","항아리","호랑이의 해","호박 파이","호박","호박전","회복약","효모"
]
const apikey1 = "a698ca8d-e634-4999-8572-60040500b6ac"
const apikey2 = "f9a4a943-2ac8-4202-8208-7886afc5d67b"
const apikey3 = "7cd97c8f-4ee8-47b4-af11-cc37e8758322"

let FinalResultEmbed
function wait(ms) {
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
};
/*
function vested(input) {
    if (input == true) {
        return "옮기기 불가"
    } else if (input == false) {
            return "옮기기 가능"
    }
}

function collectible(input) {
    if (input == true) {
        return "도감 등록 가능"
    } else if (input == false) {
            return "도감 등록 불가"
    }
}
*/

function getBhmoApi(item) {
    /** 파머모 api를 이용한 아이템 조회 ,json으로 반환*/
    axios.get('https://farm.jjo.kr/api/static/item/'+encodeURI(item), {headers: {Authorization: 'Bearer ' + apikey1 }})
        .then(function(response){
        if (response.data.options == undefined) {
            //활동력 회복 없을 경우
            let vested = (response.data.data.vested == true)? '불가능' : '가능' 
            let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
            const resultEmbed = new EmbedBuilder()
            .setTitle(response.data.icon+response.data.names.ko)
            .setDescription(response.data.descriptions.ko)
            .addFields(
                {name:"옮기기",value:vested},
                {name:"도감등록",value:collectible},
                {name:"무게",value:String(response.data.data.weight)}
            )
            .setTimestamp()
            .setColor("Green")
        } else {
            //활동력 회복 있을 경우
            let vested = (response.data.data.vested == true)? '불가능' : '가능' 
            let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
            const resultEmbed = new EmbedBuilder()
            .setTitle(response.data.icon+response.data.names.ko)
            .setDescription(response.data.descriptions.ko)
            .addFields(
                {name:"옮기기",value:vested},
                {name:"도감등록",value:collectible},
                {name:"무게",value:String(response.data.data.weight)},
                {name:'활동력 회복',value:":blue_heart:"+String(response.data.data.options.health)}
            )
            .setTimestamp()
            .setColor("Green")
        }
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bhmo')
        .setDescription('파머모 아이템 조회 (작물,건물 안됨!!)')
        .addStringOption(option => option.setName('item').setDescription('아이템 이름').setRequired(true)),
    async execute(interaction) {
        let itemName = interaction.options.getString('item');
        if (itemList.includes(itemName)) {
            axios.get('https://farm.jjo.kr/api/static/item/'+encodeURI(itemName), {headers: {Authorization: 'Bearer ' + apikey1 }})
                .then(function(response){
                if (response.status == 429) {
                    axios.get('https://farm.jjo.kr/api/static/item/'+encodeURI(itemName), {headers: {Authorization: 'Bearer ' + apikey2 }})
                .then(function(response){
                if (response.status == 429) {
                    axios.get('https://farm.jjo.kr/api/static/item/'+encodeURI(itemName), {headers: {Authorization: 'Bearer ' + apikey3 }})
                .then(function(response){
                if (response.status == 429) {
                    const errorEmbed = new EmbedBuilder()
                    .setTitle(":no_entry:한도 초과")
                    .setColor("Red")
                    .setDescription("3초 후에 다시 시도해주세요\n아이템 이름 : "+itemName)
                    interaction.reply({embeds:[errorEmbed]})
                }
                else if (response.status == 200){
                if (response.data.data.options == undefined) {
                    //활동력 회복 없을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                } else {
                    //활동력 회복 있을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false},
                        {name:'활동력 회복',value:":blue_heart:`"+String(response.data.data.options.health)+'`',inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                }}
                else {
                    const errorEmbed = new EmbedBuilder()
                    .setTitle(":no_entry:오류 발생")
                    .setColor("Red")
                    .setDescription("심각한 오류 발생!")
                    interaction.reply({embeds:[errorEmbed]})
                }
            })
                }
                else if (response.status == 200){
                if (response.data.data.options == undefined) {
                    //활동력 회복 없을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                } else {
                    //활동력 회복 있을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false},
                        {name:'활동력 회복',value:":blue_heart:`"+String(response.data.data.options.health)+'`',inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                }}
                else {
                    const errorEmbed = new EmbedBuilder()
                    .setTitle(":no_entry:오류 발생")
                    .setColor("Red")
                    .setDescription("심각한 오류 발생!")
                    interaction.reply({embeds:[errorEmbed]})
                }
            })
                }
                else if (response.status == 200){
                if (response.data.data.options == undefined) {
                    //활동력 회복 없을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                } else {
                    //활동력 회복 있을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false},
                        {name:'활동력 회복',value:":blue_heart:`"+String(response.data.data.options.health)+'`',inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                }}
                else {
                    const errorEmbed = new EmbedBuilder()
                    .setTitle(":no_entry:오류 발생")
                    .setColor("Red")
                    .setDescription("심각한 오류 발생!")
                    interaction.reply({embeds:[errorEmbed]})
                }
            })
        }
        else {
            let matches = stringSimilarity.findBestMatch(String(itemName),itemList)
            if (matches.bestMatch.rating < 0.2) {
                const resultEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(`검색결과 없음`)
                    .setDescription(`:face_with_monocle:${inlineCode(itemName)}라는 이름을 가진 아이템은 없는 것 같아요!`)
                    .setTimestamp()
                interaction.reply({ embeds: [resultEmbed],ephemeral:true })

            } else {
                itemName = matches.bestMatch.target
                axios.get('https://farm.jjo.kr/api/static/item/'+encodeURI(itemName), {headers: {Authorization: 'Bearer ' + apikey1 }})
                .then(function(response){
                if (response.status == 429) {
                    axios.get('https://farm.jjo.kr/api/static/item/'+encodeURI(itemName), {headers: {Authorization: 'Bearer ' + apikey2 }})
                .then(function(response){
                if (response.status == 429) {
                    axios.get('https://farm.jjo.kr/api/static/item/'+encodeURI(itemName), {headers: {Authorization: 'Bearer ' + apikey3 }})
                .then(function(response){
                if (response.status == 429) {
                    const errorEmbed = new EmbedBuilder()
                    .setTitle(":no_entry:한도 초과")
                    .setColor("Red")
                    .setDescription("3초 후에 다시 시도해주세요\n아이템 이름 : "+itemName)
                    interaction.reply({embeds:[errorEmbed]})
                }
                else if (response.status == 200){
                if (response.data.data.options == undefined) {
                    //활동력 회복 없을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                } else {
                    //활동력 회복 있을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false},
                        {name:'활동력 회복',value:":blue_heart:`"+String(response.data.data.options.health)+'`',inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                }}
                else {
                    const errorEmbed = new EmbedBuilder()
                    .setTitle(":no_entry:오류 발생")
                    .setColor("Red")
                    .setDescription("심각한 오류 발생!")
                    interaction.reply({embeds:[errorEmbed]})
                }
            })
                }
                else if (response.status == 200){
                if (response.data.data.options == undefined) {
                    //활동력 회복 없을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                } else {
                    //활동력 회복 있을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false},
                        {name:'활동력 회복',value:":blue_heart:`"+String(response.data.data.options.health)+'`',inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                }}
                else {
                    const errorEmbed = new EmbedBuilder()
                    .setTitle(":no_entry:오류 발생")
                    .setColor("Red")
                    .setDescription("심각한 오류 발생!")
                    interaction.reply({embeds:[errorEmbed]})
                }
            })
                }
                else if (response.status == 200){
                if (response.data.data.options == undefined) {
                    //활동력 회복 없을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                } else {
                    //활동력 회복 있을 경우
                    let vested = (response.data.data.vested == true)? '불가능' : '가능' 
                    let collectible = (response.data.data.collectible == true)? '가능' : '불가능'
                    const resultEmbed = new EmbedBuilder()
                    .setTitle(response.data.data.icon+response.data.names.ko)
                    .setDescription(response.data.descriptions.ko.replace("<:blue_haired_moremi:923442506195173456>","<:blue_haired_moremi:1027970820221452338>"))
                    .addFields(
                        {name:"옮기기",value:vested,inline:false},
                        {name:"도감등록",value:collectible,inline:false},
                        {name:"무게",value:String(response.data.data.weight),inline:false},
                        {name:'활동력 회복',value:":blue_heart:`"+String(response.data.data.options.health)+'`',inline:false}
                    )
                    .setTimestamp()
                    .setColor("Green")
                    interaction.reply({embeds:[resultEmbed]})
                }}
                else {
                    const errorEmbed = new EmbedBuilder()
                    .setTitle(":no_entry:오류 발생")
                    .setColor("Red")
                    .setDescription("심각한 오류 발생!")
                    interaction.reply({embeds:[errorEmbed]})
                }
            })
                
            }
        }
    }
};