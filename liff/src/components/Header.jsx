function Header({ displayName, studentId }) {
  return (
    <div className="bg-green-500 text-white px-4 py-5">
      <p className="text-xs font-semibold tracking-widest mb-1">
        PSU ATTENDANCE
      </p>
      <h1 className="text-lg font-bold">สวัสดี {displayName}</h1>
      <p className="text-sm mt-1">รหัสนักศึกษา: {studentId}</p>
    </div>
  );
}

export default Header;