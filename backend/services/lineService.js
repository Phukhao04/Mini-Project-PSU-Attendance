const axios = require("axios");

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

const pushMessage = async (userId, text) => {
  try {
    await axios.post(
      LINE_API_URL,
      {
        to: userId,
        messages: [
          {
            type: "text",
            text,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("LINE PUSH ERROR:", error.response?.data || error.message);
  }
};

module.exports = { pushMessage };