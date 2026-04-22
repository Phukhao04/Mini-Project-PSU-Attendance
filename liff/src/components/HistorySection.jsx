function HistorySection({ history = [] }) {
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
        })
      : "-";

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 mb-3">
        รายการล่าสุด
      </h2>

      {history.length === 0 ? (
        <p className="text-sm text-gray-400">ยังไม่มีประวัติ</p>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((item) => (
            <div
              key={item.log_id}
              className="border border-gray-100 rounded p-3 text-sm"
            >
              <p className="font-medium text-gray-700 mb-1">
                {item.log_id}
              </p>
              <p className="text-gray-500">
                เข้า: {formatDate(item.clock_in)}
              </p>
              <p className="text-gray-500">
                ออก: {formatDate(item.clock_out)}
              </p>
              <p className="text-gray-500">
                ชั่วโมง: {item.total_hour || "-"}
              </p>
              <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistorySection;