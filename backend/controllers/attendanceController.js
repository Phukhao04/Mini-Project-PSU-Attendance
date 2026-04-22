const db = require("../config/db");
const { pushMessage } = require("../services/lineService");

// Clock In
exports.clockIn = (req, res) => {
  const { student_id, location_in, lineUserId } = req.body;

  const checkOpenLogQuery = `
    SELECT *
    FROM attendance_logs
    WHERE student_id = ? AND clock_out IS NULL
    ORDER BY clock_in DESC
    LIMIT 1
  `;

  db.query(checkOpenLogQuery, [student_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "already clocked in" });
    }

    const logId = "LOG" + Date.now();
    const clockInTime = new Date();

    const insertQuery = `
      INSERT INTO attendance_logs
      (log_id, student_id, clock_in, location_in, status)
      VALUES (?, ?, ?, ?, 'in_progress')
    `;

    db.query(
      insertQuery,
      [logId, student_id, clockInTime, location_in],
      async (err2) => {
        if (err2) {
          return res.status(500).json({ message: err2.message });
        }

        if (lineUserId && lineUserId.startsWith("U")) {
          await pushMessage(
            lineUserId,
            `ลงเวลาเข้างานสำเร็จ\nเวลา: ${clockInTime.toLocaleTimeString()}`
          );
        }

        return res.json({
          message: "clock in success",
          log_id: logId,
          clock_in: clockInTime,
        });
      }
    );
  });
};

// Clock Out
exports.clockOut = (req, res) => {
  const { student_id, location_out, lineUserId } = req.body;

  const findOpenLogQuery = `
    SELECT *
    FROM attendance_logs
    WHERE student_id = ? AND clock_out IS NULL
    ORDER BY clock_in DESC
    LIMIT 1
  `;

  db.query(findOpenLogQuery, [student_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "no open clock in found" });
    }

    const log = results[0];
    const clockOutTime = new Date();

    const clockInTime = new Date(log.clock_in);
    const totalHours = (
      (clockOutTime - clockInTime) /
      (1000 * 60 * 60)
    ).toFixed(2);

    const updateQuery = `
      UPDATE attendance_logs
      SET clock_out = ?, location_out = ?, total_hour = ?, status = 'pending'
      WHERE log_id = ?
    `;

    db.query(
      updateQuery,
      [clockOutTime, location_out, totalHours, log.log_id],
      async (err2) => {
        if (err2) {
          return res.status(500).json({ message: err2.message });
        }

        if (lineUserId && lineUserId.startsWith("U")) {
          await pushMessage(
            lineUserId,
            `ลงเวลาออกงานสำเร็จ\nเวลา: ${clockOutTime.toLocaleTimeString()}\nรวม: ${totalHours} ชั่วโมง`
          );
        }

        return res.json({
          message: "clock out success",
          log_id: log.log_id,
          clock_out: clockOutTime,
          total_hour: totalHours,
        });
      }
    );
  });
};

// Get History
exports.getHistory = (req, res) => {
  const { student_id } = req.params;

  const query = `
    SELECT *
    FROM attendance_logs
    WHERE student_id = ?
    ORDER BY clock_in DESC
  `;

  db.query(query, [student_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    return res.json({
      student_id,
      history: results,
    });
  });
};