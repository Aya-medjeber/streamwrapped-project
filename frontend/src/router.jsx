import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Wrapped from "./pages/Wrapped";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/upload", element: <Upload /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/wrapped", element: <Wrapped /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
