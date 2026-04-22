import { useState } from "react";

function ReportSection({ onSubmit, onClose }) {
  const [detail, setDetail] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold">รายละเอียดงาน</h2>
          <button onClick={onClose} className="text-gray-400 text-xl">
            ✕
          </button>
        </div>

        <textarea
          className="border border-gray-300 rounded w-full px-3 py-2 text-sm mb-4 resize-none"
          rows={4}
          placeholder="กรอกรายละเอียดงานที่ทำวันนี้..."
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />

        <button
          onClick={() => onSubmit(detail)}
          className="bg-blue-500 text-white w-full py-3 rounded-lg font-medium text-sm"
        >
          ส่งรายงาน
        </button>
      </div>
    </div>
  );
}

export default ReportSection;