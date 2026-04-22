import { useState, useEffect } from "react";
import Header from "../components/Header";
import ClockSection from "../components/ClockSection";
import TodaySection from "../components/TodaySection";
import HistorySection from "../components/HistorySection";
import ReportSection from "../components/ReportSection";
import BottomNav from "../components/BottomNav";
import StudentIdForm from "../components/StudentIdForm";
import LocationCard from "../components/LocationCard";
import { useLiffInit } from "../hooks/useLiffInit";
import { useAttendance } from "../hooks/useAttendance";

const LIFF_ID = import.meta.env.VITE_LIFF_ID;

function HomePage() {
  const { loading, profile, studentId, needStudentId, saveStudentId } =
    useLiffInit(LIFF_ID);

  const [studentIdInput, setStudentIdInput] = useState("");

  const {
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
  } = useAttendance(studentId);

  useEffect(() => {
    if (studentId) {
      fetchHistory();
    }
  }, [studentId]);

  const handleSaveStudentId = () => {
    if (!studentIdInput.trim()) return;
    saveStudentId(studentIdInput.trim());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">กำลังโหลด...</p>
      </div>
    );
  }

  if (needStudentId) {
    return (
      <StudentIdForm
        value={studentIdInput}
        onChange={(e) => setStudentIdInput(e.target.value)}
        onSave={handleSaveStudentId}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20">
      <Header
        displayName={profile?.displayName || "ผู้ใช้"}
        studentId={studentId}
      />

      <div className="px-4 mt-4 flex flex-col gap-4">
        <ClockSection onClockIn={handleClockIn} onClockOut={handleClockOut} />

        <TodaySection
          status={status}
          clockInTime={clockInTime}
          clockOutTime={clockOutTime}
          totalHours={totalHours}
          message={message}
          logId={logId}
        />

        <LocationCard location={location} />

        {locationError && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded">
            {locationError}
          </div>
        )}

        <HistorySection history={history} />
      </div>

      {showReport && (
        <ReportSection
          onSubmit={handleSubmitReport}
          onClose={() => setShowReport(false)}
        />
      )}

      <BottomNav />
    </div>
  );
}

export default HomePage;