const axios = require('axios');

module.exports.config = {
    name: "searchsong",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Search music from RGDPS",
    usePrefix: true,
    commandCategory: "RGDPS TOOLS",
    usages: "[searchsong]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const searchSong = encodeURIComponent(args.join(" ").trim());

    const apiUrl = `https://johnrickgdp.ps.fhgdps.com/dashboard/api/songs.php?search=${searchSong}`;

    if (!searchSong) {
        return api.sendMessage("Please provide a song name to search for.\n\nUsage: /searchmusic [searchsong]", event.threadID, event.messageID);
    }

    try {

      const pogi = "🔍 | Checking The Database for Searching Songs Uploads. Please wait...";
        api.sendMessage(pogi, event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const responseData = response.data;

        if (responseData.dashboard && responseData.success) {
            const songs = responseData.songs;
            let message = `✅ | 𝙎𝙀𝘼𝙍𝘾𝙃 𝙍𝙀𝙎𝙐𝙇𝙏𝙎\n━━━━━━━━━━━━━━━━━━\n`;

            songs.forEach((song, index) => {
                message += `#${index + 1}\n📝 𝙄𝘿: ${song.ID}\n👤 Author: ${song.author}\n𝙉𝙖𝙢𝙚: ${song.name}\n☁️ 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙: ${song.download}\n\n`;
            });

          api.sendMessage(message, event.threadID, event.messageID);
        } else {
            api.sendMessage("No songs found matching the search query.", event.threadID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
