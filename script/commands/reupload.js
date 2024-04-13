const axios = require('axios');

module.exports.config = {
    name: "uploadsong",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Reupload music from gdph serve",
    usePrefix: true,
    commandCategory: "RGDPS TOOLS",
    usages: "[name | author | songlink]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const [title, artist, link] = args.join(" ").split("|").map(arg => arg.trim());

    const apiUrl = `https://johnrickgdp.ps.fhgdps.com/dashboard/api/addSong.php?name=${encodeURIComponent(title)}&author=${encodeURIComponent(artist)}&download=${encodeURIComponent(link)}`;

    if (!title || !artist || !link) {
        return api.sendMessage("Please provide name, author, and song link.\n\nUsage: ?rmusic name | author | songlink", event.threadID, event.messageID);
    }

    try {

const searching = "☁️ | Reuploading song. Please wait...";

        api.sendMessage(searching, event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const responseData = response.data;

        if (responseData.dashboard && responseData.success) {
            const songInfo = responseData.song;
            const message = `✅ | 𝙍𝙀𝙐𝙋𝙇𝙊𝘼𝘿𝙀𝙍 𝙍𝙂𝘿𝙋𝙎\n━━━━━━━━━━━━━━━━━━\n𝙄𝘿: ${songInfo.ID}\n𝘼𝙪𝙩𝙝𝙤𝙧: ${songInfo.author}\n𝙉𝙖𝙢𝙚: ${songInfo.name}\n𝙎𝙞𝙯𝙚: ${songInfo.size} MB\n𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙇𝙞𝙣𝙠: ${songInfo.download}\n`;

            api.sendMessage(message, event.threadID, event.messageID);
        } else if (responseData.dashboard && !responseData.success && responseData.error === 3) {
            api.sendMessage("❌ | This song was already reuploaded.", event.threadID);
        } else {
            api.sendMessage("👨‍🔧 | An error occurred while processing your request.", event.threadID);
        }
      api.unsendMessage(searching.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
