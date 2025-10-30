exports.up = async function (knex) {
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('email').unique().notNullable();
    t.string('password_hash').notNullable();
    t.enu('role', ['viewer', 'coordinator']).notNullable().defaultTo('viewer');
  });

  await knex.schema.createTable('drivers', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('phone').notNullable();
  });

  await knex.schema.createTable('vehicles', (t) => {
    t.increments('id').primary();
    t.string('plate').notNullable();
    t.integer('capacity').notNullable();
  });

  await knex.schema.createTable('service_requests', (t) => {
    t.increments('id').primary();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.string('customer_name').notNullable();
    t.string('phone').notNullable();
    t.string('pickup_location').notNullable();
    t.string('dropoff_location').notNullable();
    t.timestamp('pickup_time').notNullable();
    t.integer('passengers').notNullable();
    t.text('notes');
    t.enu('status', ['pending', 'approved', 'rejected', 'scheduled']).notNullable().defaultTo('pending');
  });

  await knex.schema.createTable('assignments', (t) => {
    t.increments('id').primary();
    t.integer('request_id').references('id').inTable('service_requests').onDelete('CASCADE');
    t.integer('driver_id').references('id').inTable('drivers');
    t.integer('vehicle_id').references('id').inTable('vehicles');
    t.timestamp('scheduled_time').notNullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('assignments');
  await knex.schema.dropTableIfExists('service_requests');
  await knex.schema.dropTableIfExists('vehicles');
  await knex.schema.dropTableIfExists('drivers');
  await knex.schema.dropTableIfExists('users');
};
