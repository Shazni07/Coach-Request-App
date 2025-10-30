import Joi from 'joi';

export const createSchema = Joi.object({
  customer_name: Joi.string().min(2).required(),
  phone: Joi.string().min(7).required(),
  pickup_location: Joi.string().required(),
  dropoff_location: Joi.string().required(),
  pickup_time: Joi.date().iso().required(),
  passengers: Joi.number().integer().min(1).required(),
  notes: Joi.string().allow('', null)
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected', 'scheduled').required()
});

export const scheduleSchema = Joi.object({
  driver_id: Joi.number().integer().required(),
  vehicle_id: Joi.number().integer().required(),
  scheduled_time: Joi.date().iso().required()
});
