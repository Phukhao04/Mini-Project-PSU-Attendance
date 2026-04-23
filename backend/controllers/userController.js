const db = require("../config/db");

// sync user จาก LINE
exports.syncUser = (req, res) => {
  const { lineUserId, displayName } = req.body;

  if (!lineUserId) {
    return res.status(400).json({ message: "lineUserId is required" });
  }

  const query = `
    INSERT INTO users (line_user_id, display_name)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
      display_name = VALUES(display_name)
  `;

  db.query(query, [lineUserId, displayName || null], (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    return res.json({ message: "user synced successfully" });
  });
};

// ผูก student_id ให้ user
exports.bindStudentId = (req, res) => {
  const { lineUserId, studentId } = req.body;

  if (!lineUserId || !studentId) {
    return res.status(400).json({ message: "lineUserId and studentId are required" });
  }

  // กัน student_id ซ้ำกับคนอื่น
  const checkQuery = `
    SELECT line_user_id
    FROM users
    WHERE student_id = ? AND line_user_id <> ?
  `;

  db.query(checkQuery, [studentId, lineUserId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (rows.length > 0) {
      return res.status(409).json({ message: "studentId already used by another user" });
    }

    const updateQuery = `
      UPDATE users
      SET student_id = ?, display_name = display_name
      WHERE line_user_id = ?
    `;

    db.query(updateQuery, [studentId, lineUserId], (err2, result) => {
      if (err2) {
        return res.status(500).json({ message: err2.message });
      }

      return res.json({
        message: "studentId bound successfully",
        affectedRows: result.affectedRows,
      });
    });
  });
};

// ดึงข้อมูลตัวเอง
exports.getMe = (req, res) => {
  const { lineUserId } = req.params;

  const query = `
    SELECT line_user_id, student_id, display_name
    FROM users
    WHERE line_user_id = ?
    LIMIT 1
  `;

  db.query(query, [lineUserId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    return res.json({
      user: rows[0] || null,
    });
  });
};