import liff from "@line/liff";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export const getHistory = async (studentId) => {
  const res = await fetch(`${API_BASE}/api/attendance/history/${studentId}`);
  return res.json();
};

export const clockInApi = async (studentId, locationIn) => {
  const profile = await liff.getProfile();

  const res = await fetch(`${API_BASE}/api/attendance/clock-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: studentId,
      location_in: locationIn,
      lineUserId: profile.userId,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data;
};

export const clockOutApi = async (studentId, locationOut) => {
  const profile = await liff.getProfile();

  const res = await fetch(`${API_BASE}/api/attendance/clock-out`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: studentId,
      location_out: locationOut,
      lineUserId: profile.userId,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data;
};

export const submitReportApi = async (logId, detail) => {
  const res = await fetch(`${API_BASE}/api/work-reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      log_id: logId,
      detail,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data;
};