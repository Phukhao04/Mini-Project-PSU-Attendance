import { useNavigate, useLocation } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm">
      <ul className="flex max-w-md mx-auto">
        <li className="flex-1">
          <button
            onClick={() => navigate("/")}
            className={`w-full py-3 text-sm ${
              isActive("/") ? "text-green-600 font-semibold" : "text-gray-500"
            }`}
          >
            หน้าหลัก
          </button>
        </li>

        <li className="flex-1">
          <button
            onClick={() => navigate("/history")}
            className={`w-full py-3 text-sm ${
              isActive("/history")
                ? "text-green-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            ประวัติ
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default BottomNav;
