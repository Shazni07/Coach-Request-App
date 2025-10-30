import { db } from '../db.js';
import { makeError } from '../utils/validate.js';
import { createSchema, updateStatusSchema, scheduleSchema } from './requests.validators.js';

export async function createRequest(req, res) {
  const { error, value } = createSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = Object.fromEntries(error.details.map(d => [d.context.key, d.message]));
    return res.status(400).json(makeError('Validation failed', errors));
  }
  const [id] = await db('service_requests').insert(value);
  const row = await db('service_requests').where({ id }).first();
  res.status(201).json(row);
}

export async function listRequests(req, res) {
  const { page = 1, size = 10, q = '', status } = req.query;
  const base = db('service_requests').modify(qb => {
    if (q) qb.whereILike('customer_name', `%${q}%`).orWhereILike('phone', `%${q}%`);
    if (status) qb.andWhere('status', status);
  });
  const items = await base.clone().orderBy('created_at', 'desc').limit(size).offset((page - 1) * size);
  const [{ count }] = await base.clone().count({ count: '*' });
  res.json({ items, total: Number(count) });
}

export async function getRequest(req, res) {
  const row = await db('service_requests').where({ id: req.params.id }).first();
  if (!row) return res.status(404).json({ message: 'Not found' });
  const assignment = await db('assignments').where({ request_id: row.id }).first();
  res.json({ ...row, assignment });
}

export async function updateStatus(req, res) {
  const { error, value } = updateStatusSchema.validate(req.body);
  if (error) return res.status(400).json(makeError('Validation failed', { status: error.message }));
  const exists = await db('service_requests').where({ id: req.params.id }).first();
  if (!exists) return res.status(404).json({ message: 'Not found' });
  await db('service_requests').where({ id: req.params.id }).update({ status: value.status });
  const row = await db('service_requests').where({ id: req.params.id }).first();
  res.json(row);
}

export async function schedule(req, res) {
  const { error, value } = scheduleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = Object.fromEntries(error.details.map(d => [d.context.key, d.message]));
    return res.status(400).json(makeError('Validation failed', errors));
  }
  const exists = await db('service_requests').where({ id: req.params.id }).first();
  if (!exists) return res.status(404).json({ message: 'Not found' });
  await db('service_requests').where({ id: req.params.id }).update({ status: 'scheduled' });
  const [assignmentId] = await db('assignments').insert({ request_id: req.params.id, ...value });
  const assignment = await db('assignments').where({ id: assignmentId }).first();
  res.json({ ...exists, status: 'scheduled', assignment });
}

export async function remove(req, res) {
  const deleted = await db('service_requests').where({ id: req.params.id }).del();
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
}

export async function listDrivers(_req, res) { res.json(await db('drivers').orderBy('name')); }
export async function listVehicles(_req, res) { res.json(await db('vehicles').orderBy('plate')); }

export async function dailyAnalytics(_req, res) {
  const rows = await db('service_requests')
    .select(db.raw('DATE(created_at) AS day'))
    .count({ count: '*' })
    .groupBy('day')
    .orderBy('day', 'desc')
    .limit(7);
  res.json(rows.reverse());
}
