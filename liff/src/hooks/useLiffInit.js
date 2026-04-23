import { useEffect, useState } from "react";
import liff from "@line/liff";
import { bindStudentIdApi, getMeApi, syncUserApi } from "../services/api";

export const useLiffInit = (liffId) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [needStudentId, setNeedStudentId] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }

        const userProfile = await liff.getProfile();
        setProfile(userProfile);
        setUserId(userProfile.userId);

        await syncUserApi({
          lineUserId: userProfile.userId,
          displayName: userProfile.displayName,
        });

        const me = await getMeApi(userProfile.userId);

        if (me?.user?.student_id) {
          setStudentId(me.user.student_id);
          setNeedStudentId(false);
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

  const saveStudentId = async (sid) => {
    if (!userId) return;

    await bindStudentIdApi({
      lineUserId: userId,
      studentId: sid,
    });

    setStudentId(sid);
    setNeedStudentId(false);
  };

  return {
    loading,
    profile,
    userId,
    studentId,
    needStudentId,
    saveStudentId,
    setStudentId,
  };
};