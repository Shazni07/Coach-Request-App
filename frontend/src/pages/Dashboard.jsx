import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import {
  CheckCircle2,
  XCircle,
  CalendarClock,
  LogOut,
  Loader2,
  Users,
} from "lucide-react";
import Modal from "../components/Modal";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState({
    driver_id: "",
    vehicle_id: "",
    scheduled_time: "",
  });

  const { role, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) navigate("/login");
    else load();
  }, [role, status]);

  async function load() {
    setLoading(true);
    try {
      const res = await api.authed(`/service-requests?status=${status}`);
      const data = await res.json();
      setItems(data.items || []);
      if (role === "coordinator") {
        fetchDrivers();
        fetchVehicles();
      }
    } catch {
      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchDrivers() {
    const res = await api.authed(`/drivers`);
    setDrivers(await res.json());
  }

  async function fetchVehicles() {
    const res = await api.authed(`/vehicles`);
    setVehicles(await res.json());
  }

  async function changeStatus(id, newStatus) {
    if (role !== "coordinator") return;
    try {
      await api.authed(`/service-requests/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Request ${newStatus}!`);
      load();
    } catch {
      toast.error("Failed to update status.");
    }
  }

  async function handleScheduleSubmit(e) {
    e.preventDefault();
    try {
      await api.authed(`/service-requests/${selected.id}/schedule`, {
        method: "POST",
        body: JSON.stringify(schedule),
      });
      toast.success("Trip scheduled successfully!");
      setShowModal(false);
      load();
    } catch {
      toast.error("Failed to schedule trip.");
    }
  }

  function getStatusBadge(status) {
    const map = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      approved: "bg-green-100 text-green-800 border border-green-300",
      rejected: "bg-red-100 text-red-800 border border-red-300",
      scheduled: "bg-blue-100 text-blue-800 border border-blue-300",
    };
    const label = status?.charAt(0).toUpperCase() + status?.slice(1);
    return (
      <span
        className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${map[status]}`}
      >
        {label}
      </span>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-blue-700 flex items-center gap-2">
          {role === "coordinator" ? "Coordinator Dashboard" : "Viewer Dashboard"}
        </h2>
        <button
          onClick={() => {
            logout();
            toast("You’ve been logged out.", { icon: "👋" });
          }}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md text-sm transition"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-600">Filter by status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No service requests found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Pickup</th>
                <th className="p-2 text-left">Dropoff</th>
                <th className="p-2 text-left">Pickup Time</th>
                <th className="p-2 text-center">Passengers</th>
                <th className="p-2 text-center">Status</th>
                <th className="p-2 text-left">Driver</th>
                <th className="p-2 text-left">Vehicle</th>
                <th className="p-2 text-left">Scheduled Time</th>
                {role === "coordinator" && (
                  <th className="p-2 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr
                  key={r.id}
                  className="border-t hover:bg-gray-50 transition duration-100"
                >
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">{r.customer_name}</td>
                  <td className="p-2">{r.pickup_location}</td>
                  <td className="p-2">{r.dropoff_location}</td>
                  <td className="p-2">
                    {r.pickup_time
                      ? new Date(r.pickup_time).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-2 text-center flex items-center justify-center gap-1">
                    <Users size={14} /> {r.passengers || "—"}
                  </td>
                  <td className="p-2 text-center">{getStatusBadge(r.status)}</td>
                  <td className="p-2">
                    {r.assignment?.driver_name || (
                      <span className="text-gray-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="p-2">
                    {r.assignment?.vehicle_plate || (
                      <span className="text-gray-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="p-2">
                    {r.assignment?.scheduled_time
                      ? new Date(r.assignment.scheduled_time).toLocaleString()
                      : "—"}
                  </td>

                  {/* Coordinator Actions */}
                  {role === "coordinator" && (
                    <td className="p-2 flex gap-2 justify-center">
                      {r.status === "pending" && (
                        <>
                          <button
                            onClick={() => changeStatus(r.id, "approved")}
                            className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            onClick={() => changeStatus(r.id, "rejected")}
                            className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      )}

                      {r.status === "approved" && (
                        <button
                          onClick={() => {
                            setSelected(r);
                            setShowModal(true);
                          }}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                        >
                          <CalendarClock size={14} /> Schedule
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Schedule Modal (Only for Coordinators) */}
      {role === "coordinator" && (
        <Modal
          open={showModal}
          title={`Schedule Request #${selected?.id}`}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Driver</label>
              <select
                value={schedule.driver_id}
                onChange={(e) =>
                  setSchedule({ ...schedule, driver_id: e.target.value })
                }
                required
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select driver</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Vehicle</label>
              <select
                value={schedule.vehicle_id}
                onChange={(e) =>
                  setSchedule({ ...schedule, vehicle_id: e.target.value })
                }
                required
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plate} (capacity: {v.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Schedule Time
              </label>
              <input
                type="datetime-local"
                value={schedule.scheduled_time}
                onChange={(e) =>
                  setSchedule({ ...schedule, scheduled_time: e.target.value })
                }
                required
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Confirm Schedule
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
