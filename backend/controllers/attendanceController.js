const db = require("../config/db");
const { pushMessage } = require("../services/lineService");

function getUserByLineUserId(lineUserId, callback) {
  const query = `
    SELECT line_user_id, student_id, display_name
    FROM users
    WHERE line_user_id = ?
    LIMIT 1
  `;

  db.query(query, [lineUserId], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows[0] || null);
  });
}

// Clock In
exports.clockIn = (req, res) => {
  const { lineUserId, location_in } = req.body;

  if (!lineUserId) {
    return res.status(400).json({ message: "lineUserId is required" });
  }

  getUserByLineUserId(lineUserId, (err, user) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!user.student_id) {
      return res.status(400).json({ message: "studentId not bound yet" });
    }

    const checkOpenLogQuery = `
      SELECT *
      FROM attendance_logs
      WHERE student_id = ? AND clock_out IS NULL
      ORDER BY clock_in DESC
      LIMIT 1
    `;

    db.query(checkOpenLogQuery, [user.student_id], (err2, results) => {
      if (err2) {
        return res.status(500).json({ message: err2.message });
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
        [logId, user.student_id, clockInTime, location_in],
        async (err3) => {
          if (err3) {
            return res.status(500).json({ message: err3.message });
          }

          if (lineUserId.startsWith("U")) {
            const date = clockInTime.toLocaleDateString("th-TH");
            const time = clockInTime.toLocaleTimeString("th-TH");

            await pushMessage(
              lineUserId,
              `ลงเวลาเข้างานสำเร็จ\nวันที่: ${date}\nเวลา: ${time}`
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
  });
};

// Clock Out
exports.clockOut = (req, res) => {
  const { lineUserId, location_out } = req.body;

  if (!lineUserId) {
    return res.status(400).json({ message: "lineUserId is required" });
  }

  getUserByLineUserId(lineUserId, (err, user) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!user.student_id) {
      return res.status(400).json({ message: "studentId not bound yet" });
    }

    const findOpenLogQuery = `
      SELECT *
      FROM attendance_logs
      WHERE student_id = ? AND clock_out IS NULL
      ORDER BY clock_in DESC
      LIMIT 1
    `;

    db.query(findOpenLogQuery, [user.student_id], (err2, results) => {
      if (err2) {
        return res.status(500).json({ message: err2.message });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "no open clock in found" });
      }

      const log = results[0];
      const clockOutTime = new Date();
      const clockInTime = new Date(log.clock_in);

      const totalHours = (
        (clockOutTime - clockInTime) / (1000 * 60 * 60)
      ).toFixed(2);

      const updateQuery = `
        UPDATE attendance_logs
        SET clock_out = ?, location_out = ?, total_hour = ?, status = 'pending'
        WHERE log_id = ?
      `;

      db.query(
        updateQuery,
        [clockOutTime, location_out, totalHours, log.log_id],
        async (err3) => {
          if (err3) {
            return res.status(500).json({ message: err3.message });
          }

          if (lineUserId.startsWith("U")) {
            const date = clockOutTime.toLocaleDateString("th-TH");
            const time = clockOutTime.toLocaleTimeString("th-TH");

            await pushMessage(
              lineUserId,
              `ลงเวลาออกงานสำเร็จ\nวันที่: ${date}\nเวลา: ${time}\nรวม: ${totalHours} ชั่วโมง`
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
  });
};

// History
exports.getHistory = (req, res) => {
  const { lineUserId } = req.params;

  getUserByLineUserId(lineUserId, (err, user) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!user.student_id) {
      return res.status(400).json({ message: "studentId not bound yet" });
    }

    const query = `
      SELECT *
      FROM attendance_logs
      WHERE student_id = ?
      ORDER BY clock_in DESC
    `;

    db.query(query, [user.student_id], (err2, results) => {
      if (err2) {
        return res.status(500).json({ message: err2.message });
      }

      return res.json({
        lineUserId,
        student_id: user.student_id,
        history: results,
      });
    });
  });
};