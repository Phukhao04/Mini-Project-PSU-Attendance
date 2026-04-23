import { useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { useAttendance } from "../hooks/useAttendance";
import { useLiffInit } from "../hooks/useLiffInit";

const LIFF_ID = import.meta.env.VITE_LIFF_ID;

function HistoryPage() {
  const { loading, userId, needStudentId } = useLiffInit(LIFF_ID);
  const { history, fetchHistory } = useAttendance(userId);

  useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  }, [userId, fetchHistory]);

  const totalHours = history.reduce(
    (sum, item) => sum + Number(item.total_hour || 0),
    0
  );

  const REQUIRED_HOURS = 100;
  const progress = Math.min((totalHours / REQUIRED_HOURS) * 100, 100);

  if (loading) {
    return <div className="p-4">กำลังโหลด...</div>;
  }

  if (needStudentId) {
    return <div className="p-4">กรุณากรอกรหัสนักศึกษาที่หน้าแรกก่อน</div>;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 p-4">
      <h1 className="text-lg font-bold mb-4">สรุปการทำงาน</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <p className="text-sm text-gray-500">ชั่วโมงสะสม</p>
        <p className="text-2xl font-bold text-green-600">
          {totalHours.toFixed(2)} ชม.
        </p>

        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progress.toFixed(0)}% ของ {REQUIRED_HOURS} ชั่วโมง
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="bg-white p-4 rounded-lg shadow text-sm text-gray-500">
            ยังไม่มีประวัติ
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.log_id}
              className="bg-white p-3 rounded-lg shadow text-sm"
            >
              <p className="font-medium">{item.log_id}</p>
              <p>เข้า: {new Date(item.clock_in).toLocaleString("th-TH")}</p>
              <p>
                ออก:{" "}
                {item.clock_out
                  ? new Date(item.clock_out).toLocaleString("th-TH")
                  : "-"}
              </p>
              <p className="text-green-600 font-semibold">
                {Number(item.total_hour || 0).toFixed(2)} ชม.
              </p>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default HistoryPage;