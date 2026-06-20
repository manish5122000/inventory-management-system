import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <Toaster position="top-right" toastOptions={{
      duration: 3000,
      style: {
        background: "#ffffff",
        color: "#1e293b",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        borderRadius: "0.5rem",
        padding: "0.75rem 1rem",
      },
      success: {
        iconTheme: {
          primary: "#10b981",
          secondary: "#ffffff",
        },
      },
      error: {
        iconTheme: {
          primary: "#ef4444",
          secondary: "#ffffff",
        },
      },
    }} />
  </BrowserRouter>
);