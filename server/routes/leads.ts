import { Router, Request, Response } from "express";
import {
  getAllLeads,
  getLeadByID,
  createLead,
  updateEnrichedLead,
} from "../queries/leads";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { runResearchAgent } from "../lib/researchAgent";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const leads = await getAllLeads();
  res.json(leads);
});

router.get("/:id", async (req: Request, res: Response) => {
  const lead = await getLeadByID(req.params.id);
  res.json(lead);
});

router.post("/:id/enrich", async (req: Request, res: Response) => {
  const enrichment_client = new SQSClient({});
  const ENRICHMENT_QUEUE_URL = process.env.enrichment_queue_url;
  console.log("Enrichment queue URL:", ENRICHMENT_QUEUE_URL);

  const enrichment_params = {
    MessageBody: JSON.stringify({
      leadId: req.params.id,
    }),
    QueueUrl: ENRICHMENT_QUEUE_URL,
  };

  const researchPrompt = req.body.prompt;
  const leadData = req.body.leadData;

  try {
    const researchResult = await runResearchAgent(researchPrompt, leadData);

    const updatedLead = await updateEnrichedLead(req.params.id, researchResult);

    res.status(200).json({
      updatedLead,
    });
  } catch (err) {
    console.log("Error enriching leads", err);
    res.status(500).json({ error: "Failed to enrich lead" });
  }

  // try {
  //   const enrichment_result = await enrichment_client.send(
  //     new SendMessageCommand(enrichment_params)
  //   );
  //   res.status(201).json(enrichment_result);
  //   console.log("SQS response:", enrichment_result);
  // } catch (err) {
  //   res.status(500).json(enrichment_params);
  //   console.log("Error sending message", err);
  // }
});

router.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, company } = req.body;
  const newLead = await createLead(name, company);
  res.status(201).json(newLead);
});

export default router;
