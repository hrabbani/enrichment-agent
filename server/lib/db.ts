import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const pool = new Pool({
  host: process.env.rds_host,
  user: process.env.rds_user,
  password: process.env.rds_password,
  database: process.env.rds_db,
  port: parseInt(process.env.rds_port || "5432", 10),
  max: 20,
  ssl: {
    rejectUnauthorized: false,
  },
});
