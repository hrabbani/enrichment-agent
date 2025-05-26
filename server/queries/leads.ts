import dotenv from "dotenv";
import { pool } from "../lib/db";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

pool.connect((err) => err && console.log(err));

// QUERIES
export const getAllLeads = async () => {
  const result = await pool.query("SELECT * FROM leads");
  return result.rows;
};

export const getLeadByID = async (id: string) => {
  const result = await pool.query("SELECT * FROM leads WHERE id = $1", [id]);
  return result.rows[0];
};

export const createLead = async (name: string, company: string) => {
  const result = await pool.query(
    "INSERT INTO leads (name, company) VALUES ($1, $2) RETURNING *",
    [name, company]
  );
  return result.rows[0];
};

export const updateEnrichedLead = async (id: string, enriched_data: string) => {
  const result = await pool.query(
    "UPDATE leads SET enriched_data = $1 WHERE id = $2 RETURNING *",
    [enriched_data, id]
  );
  return result.rows[0];
};
