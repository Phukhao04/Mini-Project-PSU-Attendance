function TodaySection({ status, clockInTime, clockOutTime, totalHours, message, logId }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2 text-sm text-yellow-700 mb-4">
        {message}
      </div>

      <h2 className="text-sm font-semibold text-gray-500 mb-3">วันนี้</h2>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Log ID</span>
          <span className="font-medium">{logId || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">เวลาเข้างาน</span>
          <span className="font-medium">{clockInTime} น.</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">เวลาออกงาน</span>
          <span className="font-medium">{clockOutTime} น.</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">ชั่วโมงทำงาน</span>
          <span className="font-medium">{totalHours} ชม.</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">สถานะ</span>
          <span className="font-medium">{status}</span>
        </div>
      </div>
    </div>
  );
}

export default TodaySection;