import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";  // global toast notifications

import App from "./App.jsx";
import CustomerForm from "./pages/CustomerForm.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <CustomerForm /> },
      { path: "login", element: <Login /> },
      { path: "admin", element: <Dashboard /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const client = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={client}>
    <RouterProvider router={router} />
    {/* global toast provider */}
    <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
  </QueryClientProvider>
);
<Toaster
  position="top-center"
  toastOptions={{
    duration: 3000,
    style: {
      background: "#fff",
      color: "#1e293b",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
  }}
/>

