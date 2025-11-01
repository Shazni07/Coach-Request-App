import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Coach Request App
      </footer>
    </div>
  );
}
