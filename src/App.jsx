import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import PollPage from "./pages/PollPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./components/AppLayout.jsx";

export default function App() {
  return (
    // <div className="p-4 text-xl">Hello from Dish Poll!</div>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/poll" replace />} />
        <Route path="poll" element={<PollPage />} />
        <Route path="results" element={<ResultsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/poll" replace />} />
    </Routes>
  );
}
