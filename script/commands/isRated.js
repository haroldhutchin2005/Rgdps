const axios = require('axios');

module.exports.config = {
    name: "isRated",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Check if a level is rated",
    usePrefix: true,
    commandCategory: "RGDPS TOOLS",
    usages: "[levelID]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const levelID = encodeURIComponent(args.join(" ").trim());

    const apiUrl = `https://johnrickgdp.ps.fhgdps.com/dashboard/api/whoRated.php?level=${levelID}`;

    if (!levelID) {
        return api.sendMessage("Please provide a level ID to check.\n\nUsage: /isRated [levelID]", event.threadID, event.messageID);
    }

    try {
        api.sendMessage("🔍 | Checking if level is rated. Please wait...", event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const responseData = response.data;

        if (responseData.dashboard && responseData.success) {
            const levelInfo = responseData.level;
            const rates = responseData.rates;

            let message = `✅ | 𝙄𝙎 𝙍𝘼𝙏𝙀𝘿\n━━━━━━━━━━━━━━━━━━\n`;
            message += `📝 𝙇𝙚𝙫𝙚𝙡 𝙉𝙖𝙢𝙚: ${levelInfo.name}\n👤 𝘼𝙪𝙩𝙝𝙤𝙧: ${levelInfo.author}\n\n`;

            if (rates.length > 0) {
                message += "𝙍𝙖𝙩𝙚𝙨:\n";
                rates.forEach((rate, index) => {
                    message += `#${index + 1}\n👤 𝙐𝙨𝙚𝙧𝙣𝙖𝙢𝙚: ${rate.username}\n🏷️ 𝘼𝙘𝙘𝙤𝙪𝙣𝙩 𝙄𝘿: ${rate.accountID}\n🙂 𝘿𝙞𝙛𝙛𝙞𝙘𝙪𝙡𝙩𝙮: ${rate.difficulty}\n⭐ 𝙎𝙩𝙖𝙧𝙨: ${rate.stars}\n🕜 𝙏𝙞𝙢𝙚𝙨𝙩𝙖𝙢𝙥: ${rate.timestamp}\n\n`;
                });
            } else {
                message += "❌ | No rates found for this level.";
            }

            api.sendMessage(message, event.threadID, event.messageID);
        } else if (responseData.dashboard && !responseData.success && responseData.error === 3) {
            api.sendMessage("☹️ | This level wasn't rated.", event.threadID, event.messageID);
        } else {
            api.sendMessage("Level not found or an error occurred while processing your request.", event.threadID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
