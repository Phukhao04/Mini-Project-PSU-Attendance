function ClockSection({ onClockIn, onClockOut }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-500 mb-3">
        ลงเวลาเข้างาน
      </h2>

      <div className="flex gap-3">
        <button
          onClick={onClockIn}
          className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium"
        >
          Clock In
        </button>

        <button
          onClick={onClockOut}
          className="flex-1 bg-red-400 text-white py-3 rounded-lg font-medium"
        >
          Clock Out
        </button>
      </div>
    </div>
  );
}

export default ClockSection;