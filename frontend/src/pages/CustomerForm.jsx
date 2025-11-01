import React, { useState } from "react";
import { api } from "../api/client";
import {
  Send,
  User,
  Phone,
  MapPin,
  Calendar,
  Users,
  ClipboardList,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerForm() {
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    pickup_location: "",
    dropoff_location: "",
    pickup_time: "",
    passengers: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ------------------ VALIDATION ------------------
  function validate() {
    const newErrors = {};

    if (!form.customer_name.trim())
      newErrors.customer_name = "Full name is required.";
    else if (form.customer_name.length < 3)
      newErrors.customer_name = "Name must be at least 3 characters.";

    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Phone number must be 10 digits.";

    if (!form.pickup_location.trim())
      newErrors.pickup_location = "Pickup location is required.";
    if (!form.dropoff_location.trim())
      newErrors.dropoff_location = "Drop-off location is required.";

    if (!form.pickup_time) newErrors.pickup_time = "Pickup time is required.";
    else {
      const now = new Date();
      const selected = new Date(form.pickup_time);
      if (selected < now)
        newErrors.pickup_time = "Pickup time cannot be in the past.";
    }

    if (!form.passengers)
      newErrors.passengers = "Passenger count is required.";
    else if (form.passengers < 1)
      newErrors.passengers = "At least 1 passenger required.";
    else if (form.passengers > 60)
      newErrors.passengers = "Maximum 60 passengers allowed.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ------------------ SUBMIT ------------------
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      await api.createRequest({
        customer_name: form.customer_name,
        phone: form.phone,
        pickup_location: form.pickup_location,
        dropoff_location: form.dropoff_location,
        pickup_time: form.pickup_time,
        passengers: Number(form.passengers),
        notes: form.notes,
      });
      toast.success("✅ Request submitted successfully!");
      setForm({
        customer_name: "",
        phone: "",
        pickup_location: "",
        dropoff_location: "",
        pickup_time: "",
        passengers: "",
        notes: "",
      });
      setErrors({});
    } catch {
      toast.error("❌ Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ------------------ RENDER ------------------
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-blue-50 via-white to-blue-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-8 w-full max-w-lg border border-blue-100/50 hover:border-blue-200/50 transition-all duration-300"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/30">
            <ClipboardList size={28} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Request a Coach Trip</h2>
          <p className="text-gray-500 mt-1">Fill in your journey details below</p>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Full Name</label>
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={form.customer_name}
              onChange={(e) =>
                setForm({ ...form, customer_name: e.target.value })
              }
              className={`w-full border rounded-lg px-10 py-3 focus:ring-2 transition-all duration-200 ${
                errors.customer_name
                  ? "border-red-400 focus:ring-red-300 bg-red-50"
                  : "border-gray-300 focus:ring-blue-300 hover:border-blue-400 focus:border-blue-500"
              }`}
              placeholder="John Doe"
            />
          </div>
          {errors.customer_name && (
            <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`w-full border rounded-md px-10 py-2 focus:ring-2 ${
                errors.phone
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
              placeholder="07XXXXXXXX"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Pickup location */}
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Pickup Location
          </label>
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={form.pickup_location}
              onChange={(e) =>
                setForm({ ...form, pickup_location: e.target.value })
              }
              className={`w-full border rounded-md px-10 py-2 focus:ring-2 ${
                errors.pickup_location
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
              placeholder="Enter pickup location"
            />
          </div>
          {errors.pickup_location && (
            <p className="text-red-500 text-xs mt-1">
              {errors.pickup_location}
            </p>
          )}
        </div>

        {/* Dropoff location */}
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Drop-off Location
          </label>
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={form.dropoff_location}
              onChange={(e) =>
                setForm({ ...form, dropoff_location: e.target.value })
              }
              className={`w-full border rounded-md px-10 py-2 focus:ring-2 ${
                errors.dropoff_location
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
              placeholder="Enter drop-off location"
            />
          </div>
          {errors.dropoff_location && (
            <p className="text-red-500 text-xs mt-1">
              {errors.dropoff_location}
            </p>
          )}
        </div>

        {/* Pickup time */}
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Pickup Date & Time
          </label>
          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              value={form.pickup_time}
              onChange={(e) =>
                setForm({ ...form, pickup_time: e.target.value })
              }
              className={`w-full border rounded-md px-10 py-2 focus:ring-2 ${
                errors.pickup_time
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
            />
          </div>
          {errors.pickup_time && (
            <p className="text-red-500 text-xs mt-1">{errors.pickup_time}</p>
          )}
        </div>

        {/* Passengers */}
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Number of Passengers
          </label>
          <div className="relative">
            <Users
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              min="1"
              max="60"
              value={form.passengers}
              onChange={(e) =>
                setForm({ ...form, passengers: e.target.value })
              }
              className={`w-full border rounded-md px-10 py-2 focus:ring-2 ${
                errors.passengers
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
              placeholder="Enter number of passengers"
            />
          </div>
          {errors.passengers && (
            <p className="text-red-500 text-xs mt-1">{errors.passengers}</p>
          )}
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Additional Notes (optional)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 hover:border-blue-400 focus:border-blue-500 resize-none transition-all duration-200"
            rows="3"
            placeholder="Any special instructions..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 transition-all duration-300 disabled:opacity-70 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} /> Submit Request
            </>
          )}
        </button>
      </form>
    </div>
  );
}
