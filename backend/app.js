const express = require("express");
const path = require("path");

const lineRoutes = require("./routes/lineroutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use("/api/line", lineRoutes);
app.use(express.json());

app.use("/api/attendance", attendanceRoutes);
app.use("/api/work-reports", reportRoutes);

app.use(express.static(path.join(__dirname, "../liff/dist")));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../liff/dist/index.html"));
});

module.exports = app;