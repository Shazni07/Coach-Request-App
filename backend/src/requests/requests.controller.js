import db from "../db/db.js";
import Joi from "joi";
import { makeError } from "../utils/errors.js";

// ===============================================
// 🔹 Validation Schemas
// ===============================================

const requestSchema = Joi.object({
  customer_name: Joi.string().min(3).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  pickup_location: Joi.string().required(),
  dropoff_location: Joi.string().required(),
  pickup_time: Joi.date().iso().required(),
  passengers: Joi.number().integer().min(1).max(60).required(),
  notes: Joi.string().allow("").optional(),
});

export const scheduleSchema = Joi.object({
  driver_id: Joi.number().integer().required(),
  vehicle_id: Joi.number().integer().required(),
  scheduled_time: Joi.date().iso().required(),
});

// ===============================================
// 🔹 Create Service Request (Public)
// ===============================================
export async function createRequest(req, res) {
  try {
    const { error, value } = requestSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = Object.fromEntries(error.details.map((d) => [d.context.key, d.message]));
      return res.status(400).json(makeError("Validation failed", errors));
    }

    const [id] = await db("service_requests").insert({
      ...value,
      status: "pending",
    });

    const request = await db("service_requests").where({ id }).first();
    res.status(201).json({ message: "Request created successfully", request });
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json(makeError("Failed to create service request"));
  }
}

// ===============================================
// 🔹 List All Requests (Viewer + Coordinator)
// ===============================================
export async function getAllRequests(req, res) {
  try {
    const { status } = req.query;

    let query = db("service_requests as r")
      .leftJoin("assignments as a", "r.id", "a.request_id")
      .leftJoin("drivers as d", "a.driver_id", "d.id")
      .leftJoin("vehicles as v", "a.vehicle_id", "v.id")
      .select(
        "r.id",
        "r.customer_name",
        "r.phone",
        "r.pickup_location",
        "r.dropoff_location",
        "r.pickup_time",
        "r.passengers",
        "r.notes",
        "r.status",
        "d.name as driver_name",
        "v.plate as vehicle_plate",
        "a.scheduled_time"
      )
      .orderBy("r.id", "desc");

    if (status) query = query.where("r.status", status);

    const rows = await query;

    const items = rows.map((r) => ({
      id: r.id,
      customer_name: r.customer_name,
      phone: r.phone,
      pickup_location: r.pickup_location,
      dropoff_location: r.dropoff_location,
      pickup_time: r.pickup_time,
      passengers: r.passengers,
      notes: r.notes,
      status: r.status,
      assignment: r.driver_name
        ? {
            driver_name: r.driver_name,
            vehicle_plate: r.vehicle_plate,
            scheduled_time: r.scheduled_time,
          }
        : null,
    }));

    res.json({ items });
  } catch (err) {
    console.error("Error fetching service requests:", err);
    res.status(500).json(makeError("Failed to load service requests"));
  }
}

// ===============================================
// 🔹 Get Single Request (Viewer + Coordinator)
// ===============================================
export async function getRequest(req, res) {
  try {
    const { id } = req.params;
    const r = await db("service_requests as r")
      .leftJoin("assignments as a", "r.id", "a.request_id")
      .leftJoin("drivers as d", "a.driver_id", "d.id")
      .leftJoin("vehicles as v", "a.vehicle_id", "v.id")
      .select(
        "r.*",
        "d.name as driver_name",
        "v.plate as vehicle_plate",
        "a.scheduled_time"
      )
      .where("r.id", id)
      .first();

    if (!r) return res.status(404).json(makeError("Request not found"));

    res.json({
      ...r,
      assignment: r.driver_name
        ? {
            driver_name: r.driver_name,
            vehicle_plate: r.vehicle_plate,
            scheduled_time: r.scheduled_time,
          }
        : null,
    });
  } catch (err) {
    console.error("Error getting request:", err);
    res.status(500).json(makeError("Failed to get service request"));
  }
}

// ===============================================
// 🔹 Update Status (Coordinator)
// ===============================================
export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json(makeError("Invalid status"));
    }

    const exists = await db("service_requests").where({ id }).first();
    if (!exists) return res.status(404).json(makeError("Request not found"));

    await db("service_requests").where({ id }).update({ status });
    res.json({ message: `Request ${id} updated to ${status}` });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json(makeError("Failed to update status"));
  }
}

// ===============================================
// 🔹 Schedule Request (Coordinator)
// ===============================================
export async function schedule(req, res) {
  try {
    const { error, value } = scheduleSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = Object.fromEntries(error.details.map((d) => [d.context.key, d.message]));
      return res.status(400).json(makeError("Validation failed", errors));
    }

    const request = await db("service_requests").where({ id: req.params.id }).first();
    if (!request) return res.status(404).json(makeError("Service request not found"));

    await db("service_requests").where({ id: req.params.id }).update({ status: "scheduled" });

    const [assignmentId] = await db("assignments").insert({
      request_id: req.params.id,
      ...value,
    });

    const assignment = await db("assignments").where({ id: assignmentId }).first();

    res.json({
      ...request,
      status: "scheduled",
      assignment,
      message: "Request scheduled successfully",
    });
  } catch (err) {
    console.error("Error scheduling request:", err);
    res.status(500).json(makeError("Failed to schedule request"));
  }
}

// ===============================================
// 🔹 Delete Request (Coordinator)
// ===============================================
export async function remove(req, res) {
  try {
    const { id } = req.params;
    await db("assignments").where({ request_id: id }).del();
    const deleted = await db("service_requests").where({ id }).del();
    if (!deleted) return res.status(404).json(makeError("Request not found"));
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error("Error deleting request:", err);
    res.status(500).json(makeError("Failed to delete request"));
  }
}

// ===============================================
// 🔹 List Drivers (Viewer + Coordinator)
// ===============================================
export async function listDrivers(req, res) {
  try {
    const drivers = await db("drivers").select("*").orderBy("id");
    res.json(drivers);
  } catch (err) {
    console.error("Error listing drivers:", err);
    res.status(500).json(makeError("Failed to list drivers"));
  }
}

// ===============================================
// 🔹 List Vehicles (Viewer + Coordinator)
// ===============================================
export async function listVehicles(req, res) {
  try {
    const vehicles = await db("vehicles").select("*").orderBy("id");
    res.json(vehicles);
  } catch (err) {
    console.error("Error listing vehicles:", err);
    res.status(500).json(makeError("Failed to list vehicles"));
  }
}

// ===============================================
// 🔹 Daily Analytics (Viewer + Coordinator)
// ===============================================
export async function dailyAnalytics(req, res) {
  try {
    const rows = await db("service_requests")
      .select(
        db.raw("DATE(pickup_time) as date"),
        db.raw("COUNT(*) as total_requests"),
        db.raw(
          "SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved"
        ),
        db.raw(
          "SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected"
        ),
        db.raw(
          "SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled"
        )
      )
      .groupBy("date")
      .orderBy("date", "desc")
      .limit(7);

    res.json(rows);
  } catch (err) {
    console.error("Error loading analytics:", err);
    res.status(500).json(makeError("Failed to load analytics"));
  }
}
export async function deleteRequest(req, res) {
  try {
    const { id } = req.params;
    await db("assignments").where({ request_id: id }).del();
    const deleted = await db("service_requests").where({ id }).del();
    if (!deleted) return res.status(404).json(makeError("Request not found"));
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error("Error deleting request:", err);
    res.status(500).json(makeError("Failed to delete request"));
  }
}