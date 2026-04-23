import { useState } from "react";
import {
  getHistory,
  clockInApi,
  clockOutApi,
  submitReportApi,
} from "../services/api";
import { getCurrentLocation } from "../utils/location";

export const useAttendance = (lineUserId) => {
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

  const restoreCurrentStatus = (logs) => {
    if (!logs || logs.length === 0) return;

    const latest = logs[0]; // history เรียง DESC อยู่แล้ว

    if (!latest.clock_out) {
      setStatus("กำลังทำงาน");
      setClockInTime(
        new Date(latest.clock_in).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setClockOutTime("-");
      setTotalHours("-");
      setLogId(latest.log_id);
      setMessage("คุณกำลังเข้างานอยู่");
      setShowReport(false);
    }
  };

  const fetchHistory = async () => {
    if (!lineUserId) return;
    try {
      const data = await getHistory(lineUserId);
      const logs = data.history || [];
      setHistory(logs);
      restoreCurrentStatus(logs);
    } catch (err) {
      console.log("fetch history error:", err);
    }
  };

  const handleClockIn = async () => {
    try {
      setMessage("กำลังขอ GPS...");

      const coords = await getCurrentLocation();
      setLocation(coords);

      const data = await clockInApi(
        lineUserId,
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

  const handleClockOut = async () => {
    try {
      setMessage("กำลังขอ GPS...");

      const coords = await getCurrentLocation();
      setLocation(coords);

      const data = await clockOutApi(
        lineUserId,
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