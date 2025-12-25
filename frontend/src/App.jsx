import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Upload from "./pages/Upload.jsx";
import Wrapped from "./pages/Wrapped.jsx";
import YouTubeWrapped from "./pages/youtube/YouTubeWrapped";
import YouTubeHome from "./pages/youtube/YouTubeHome";
import YouTubeConnect from "./pages/youtube/YouTubeConnect";
import YouTubeUpload from "./pages/youtube/YouTubeUpload";
import YouTubeProcessing from "./pages/youtube/YouTubeProcessing";
import Settings from "./pages/Settings.jsx"; // ✅ ADD THIS

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wrapped" element={<Wrapped />} />
        <Route path="/youtube/wrapped" element={<YouTubeWrapped />} />
        <Route path="/youtube" element={<YouTubeHome />} />
        <Route path="/youtube/connect" element={<YouTubeConnect />} />
        <Route path="/youtube/upload" element={<YouTubeUpload />} />
        <Route path="/youtube/processing" element={<YouTubeProcessing />} />
        <Route path="/settings" element={<Settings />} /> {/* ✅ ADD THIS */}

        {/* Fallback */}
        <Route path="*" element={<div style={{ padding: 40 }}>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}
