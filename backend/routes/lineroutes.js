const express = require("express");
const router = express.Router();
const line = require("@line/bot-sdk");

const { lineConfig } = require("../config/lineConfig");
const { handleLineEvent } = require("../handlers/lineHandler");

router.post("/webhook", line.middleware(lineConfig), async (req, res) => {
  try {
    await Promise.all(req.body.events.map(handleLineEvent));
    res.status(200).send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

module.exports = router;