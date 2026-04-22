const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

router.post("/clock-in", attendanceController.clockIn);
router.post("/clock-out", attendanceController.clockOut);
router.get("/history/:student_id", attendanceController.getHistory);

module.exports = router;