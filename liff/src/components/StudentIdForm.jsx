function StudentIdForm({ value, onChange, onSave }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h2 className="text-xl font-bold mb-2">กรอกรหัสนักศึกษา</h2>
      <p className="text-gray-500 text-sm mb-4">
        กรุณากรอกรหัสนักศึกษาเพื่อเริ่มใช้งาน
      </p>

      <input
        type="text"
        placeholder="เช่น 6610210312"
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs mb-3 text-sm"
      />

      <button
        onClick={onSave}
        className="bg-green-500 text-white px-6 py-2 rounded w-full max-w-xs"
      >
        ยืนยัน
      </button>
    </div>
  );
}

export default StudentIdForm;