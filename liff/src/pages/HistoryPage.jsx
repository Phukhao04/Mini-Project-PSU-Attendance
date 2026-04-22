import { useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { useAttendance } from "../hooks/useAttendance";

function HistoryPage() {
  const studentId = localStorage.getItem("studentId");

  const { history, fetchHistory } = useAttendance(studentId);

  useEffect(() => {
    fetchHistory();
  }, []);

  // คำนวณชั่วโมงรวม
  const totalHours = history.reduce(
    (sum, item) => sum + Number(item.total_hour || 0),
    0
  );

  const REQUIRED_HOURS = 100;
  const progress = Math.min((totalHours / REQUIRED_HOURS) * 100, 100);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 p-4">
      <h1 className="text-lg font-bold mb-4">สรุปการทำงาน</h1>

      {/* Dashboard */}
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

      {/* History list */}
      <div className="space-y-3">
        {history.map((item) => (
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
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

export default HistoryPage;