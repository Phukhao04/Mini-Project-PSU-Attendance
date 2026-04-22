import { useState } from "react";
import {
  getHistory,
  clockInApi,
  clockOutApi,
  submitReportApi,
} from "../services/api";
import { getCurrentLocation } from "../utils/location";

export const useAttendance = (studentId) => {
  const [status, setStatus] = useState("ยังไม่เข้างาน");
  const [clockInTime, setClockInTime] = useState("-");
  const [clockOutTime, setClockOutTime] = useState("-");
  const [totalHours, setTotalHours] = useState("-");
  const [message, setMessage] = useState("กรุณากด Clock In เพื่อเริ่มทำงาน");
  const [logId, setLogId] = useState("");
  const [history, setHistory] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [showReport, setShowReport] = useState(false);

  const fetchHistory = async () => {
    if (!studentId) return;
    try {
      const data = await getHistory(studentId);
      setHistory(data.history || []);
    } catch (err) {
      console.log("fetch history error:", err);
    }
  };

  // ✅ CLOCK IN
  const handleClockIn = async () => {
    try {
      setMessage("กำลังขอ GPS...");

      const coords = await getCurrentLocation();
      setLocation(coords);

      const data = await clockInApi(
        studentId,
        `${coords.latitude},${coords.longitude}`
      );

      const clockInDate = new Date(data.clock_in);
      const timeStr = clockInDate.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setStatus("กำลังทำงาน");
      setClockInTime(timeStr);
      setClockOutTime("-");
      setTotalHours("-");
      setLogId(data.log_id);
      setMessage("ลงเวลาเข้างานสำเร็จ");
      setShowReport(false);

      await fetchHistory();
    } catch (err) {
      setLocationError(err.message);
      setMessage(err.message || "เกิดข้อผิดพลาด");
    }
  };

  // ✅ CLOCK OUT
  const handleClockOut = async () => {
    try {
      setMessage("กำลังขอ GPS...");

      const coords = await getCurrentLocation();
      setLocation(coords);

      const data = await clockOutApi(
        studentId,
        `${coords.latitude},${coords.longitude}`
      );

      const clockOutDate = new Date(data.clock_out);
      const timeStr = clockOutDate.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setStatus("ออกงานแล้ว");
      setClockOutTime(timeStr);
      setTotalHours(data.total_hour);
      setLogId(data.log_id);
      setMessage("ลงเวลาออกงานสำเร็จ");
      setShowReport(true);

      await fetchHistory();
    } catch (err) {
      setLocationError(err.message);
      setMessage(err.message || "เกิดข้อผิดพลาด");
    }
  };

  // ✅ SUBMIT REPORT
  const handleSubmitReport = async (detail) => {
    if (!detail.trim()) {
      setMessage("กรุณากรอกรายละเอียดงาน");
      return;
    }

    try {
      await submitReportApi(logId, detail);

      setMessage("ส่งรายงานสำเร็จ");
      setShowReport(false);
    } catch (err) {
      console.log("submit report error:", err);
      setMessage(err.message || "ส่งรายงานไม่สำเร็จ");
    }
  };

  return {
    status,
    clockInTime,
    clockOutTime,
    totalHours,
    message,
    logId,
    history,
    location,
    locationError,
    showReport,
    setShowReport,
    fetchHistory,
    handleClockIn,
    handleClockOut,
    handleSubmitReport,
  };
};