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

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const userProfile = await liff.getProfile();
        setProfile(userProfile);

        const savedStudentId = localStorage.getItem("studentId");
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

  const saveStudentId = (sid) => {
    localStorage.setItem("studentId", sid);
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