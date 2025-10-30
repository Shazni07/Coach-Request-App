require('dotenv').config();

module.exports = {
  client: 'sqlite3',
  connection: { filename: process.env.DATABASE_URL || './data.sqlite' },
  useNullAsDefault: true,
  migrations: { directory: './migrations' },
  seeds: { directory: './seeds' }
};
