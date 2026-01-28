import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login, loading, isAuthed } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    if (isAuthed) {
        navigate("/poll", { replace: true });
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const res = await login(form);
        if (!res.ok) {
            setError(res.message || "Login failed");
            return;
        }
        navigate("/poll", { replace: true });
    };

    return (
        <div className="min-h-full bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white border rounded-xl shadow-sm p-6">
                <h1 className="text-xl font-semibold">Login</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Use a username/password from <code className="text-xs">public/users.json</code>
                </p>

                <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
                    <div>
                        <label className="text-sm text-gray-700">Username</label>
                        <input
                            className="mt-1 w-full border rounded-md px-3 py-2"
                            value={form.username}
                            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full border rounded-md px-3 py-2"
                            value={form.password}
                            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                            autoComplete="current-password"
                        />
                    </div>

                    {error ? (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                            {error}
                        </div>
                    ) : null}

                    <button disabled={loading} className="mt-2 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black disabled:opacity-60" >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-4 text-xs text-gray-500">
                    Tip: try <code>user1 / password</code>
                </div>
            </div>
        </div>
    );
}
