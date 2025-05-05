import { Router, Request, Response } from "express";
import { getAllLeads, getLeadByID, createLead } from "../queries/leads";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const leads = await getAllLeads();
  res.json(leads);
});

router.get("/:id", async (req: Request, res: Response) => {
  const lead = await getLeadByID(req.params.id);
  res.json(lead);
});

router.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, company } = req.body;
  const newLead = await createLead(name, company);
  res.status(201).json(newLead);
});

export default router;
