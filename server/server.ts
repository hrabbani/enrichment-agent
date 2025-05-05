import express from "express";
import cors from "cors";
import leadRoutes from "./routes/leads";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// -- ROUTES --
app.use("/api/leads", leadRoutes);

// -------------

// config stuff
const PORT = process.env.server_port;
const HOST = process.env.server_host;

app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});

export default app;
