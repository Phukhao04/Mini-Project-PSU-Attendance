import { useEffect, useState } from "react";
import liff from "@line/liff";

export const useLiffInit = (liffId) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [needStudentId, setNeedStudentId] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({ liffId });

        // ถ้ายังไม่ login ให้ไป login แล้ว reload กลับมา
        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }

        // ดึง profile ทุกครั้งให้ชัวร์
        const userProfile = await liff.getProfile();
        setProfile(userProfile);

        const userId = userProfile?.userId;

        if (!userId) {
          console.log("No LINE userId found");
          setNeedStudentId(true);
          return;
        }

        // 🔥 แก้สำคัญ: แยก key ตาม LINE userId
        const savedStudentId = localStorage.getItem(
          `studentId_${userId}`
        );

        if (savedStudentId) {
          setStudentId(savedStudentId);
        } else {
          setNeedStudentId(true);
        }
      } catch (err) {
        console.log("liff init error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [liffId]);

  // 🔥 แก้: save แยกตาม LINE userId
  const saveStudentId = (sid) => {
    const userId = profile?.userId;

    if (!userId) return;

    localStorage.setItem(`studentId_${userId}`, sid);
    setStudentId(sid);
    setNeedStudentId(false);
  };

  return {
    loading,
    profile,
    studentId,
    needStudentId,
    saveStudentId,
    setStudentId,
  };
};