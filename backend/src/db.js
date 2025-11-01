import knex from 'knex';
import knexfile from '../knexfile.cjs';

const db = knex(knexfile);

export { db };
export default db;
