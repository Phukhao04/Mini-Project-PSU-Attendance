const db = require("../config/db");

exports.createReport = (req, res) => {
  const { log_id, detail, img } = req.body;

  if (!log_id || !detail) {
    return res.status(400).json({
      message: "log_id and detail are required",
    });
  }

  const reportId = "REP" + Date.now();

  const query = `
    INSERT INTO work_reports (report_id, log_id, detail, img)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [reportId, log_id, detail, img || null], (err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    return res.json({
      message: "report saved successfully",
      report_id: reportId,
    });
  });
};