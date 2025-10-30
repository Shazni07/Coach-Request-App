const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex('assignments').del();
  await knex('service_requests').del();
  await knex('vehicles').del();
  await knex('drivers').del();
  await knex('users').del();

  const password = await bcrypt.hash('password123', 10);
  await knex('users').insert([
    { email: 'viewer@example.com', password_hash: password, role: 'viewer' },
    { email: 'coord@example.com',  password_hash: password, role: 'coordinator' }
  ]);

  await knex('drivers').insert([
    { name: 'Alice Perera', phone: '0711111111' },
    { name: 'Bimal Silva',  phone: '0722222222' },
    { name: 'Chamari Dias', phone: '0733333333' }
  ]);

  await knex('vehicles').insert([
    { plate: 'SP-1234', capacity: 12 },
    { plate: 'WP-5678', capacity: 20 },
    { plate: 'CP-9101', capacity: 40 }
  ]);
};
