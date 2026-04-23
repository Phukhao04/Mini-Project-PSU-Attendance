const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/sync", userController.syncUser);
router.post("/bind-student-id", userController.bindStudentId);
router.get("/me/:lineUserId", userController.getMe);

module.exports = router;