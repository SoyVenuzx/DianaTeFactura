import { createPool } from 'mysql2/promise'

import {
  DB_HOST,
  DB_USER,
  DB_DATABASE,
  DB_PASSWORD,
  DB_PORT
} from './config.js'

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
})
