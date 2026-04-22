const { client } = require("../config/lineConfig");

async function handleLineEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return null;
  }

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [
      {
        type: "text",
        text: `รับข้อความแล้ว: ${event.message.text}`,
      },
    ],
  });
}

module.exports = { handleLineEvent };