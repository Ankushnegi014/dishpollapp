import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TabLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-md text-sm font-medium",
          isActive
            ? "bg-gray-900 text-white"
            : "text-gray-700 hover:bg-gray-100",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-full bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">Dish Poll</div>
            <nav className="flex gap-2">
              <TabLink to="/poll">Vote</TabLink>
              <TabLink to="/results">Results</TabLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Logged in as <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-black"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
