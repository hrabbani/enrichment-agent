import { SQSEvent, Context, SQSHandler, SQSRecord } from "aws-lambda";
import { getLeadByID } from "../queries/leads";

const axios = require("axios");

const hunter_url = "https://api.hunter.io/v2/email-finder";

export const enrichmentHandler: SQSHandler = async (
  event: SQSEvent,
  context: Context
): Promise<void> => {
  console.log("About to process leads");
  if (event.Records && Array.isArray(event.Records)) {
    await Promise.all(
      event.Records.map(async (record) => {
        enrichLeadAsync(record);
      })
    );
  } else {
    console.log(
      "No records found in the event or records is not an array",
      event
    );
  }
  console.log("Done enriching leads");
};

async function enrichLeadAsync(message: SQSRecord): Promise<void> {
  try {
    const leadId = JSON.parse(message.body).leadId;
    console.log("leadId: ", leadId);
    console.log("Getting lead by ID...");
    const leadInfo = await getLeadByID(leadId);

    const params = {
      domain: leadInfo.domain,
      company: leadInfo.company,
      first_name: leadInfo.name ? leadInfo.name.split(" ")[0] : "",
      last_name: leadInfo.name ? leadInfo.name.split(" ")[1] : "",
      full_name: leadInfo.name,
      api_key: process.env.hunter_api_key,
    };

    //hunter.io enrichment
    const enriched_res = await axios.get(hunter_url, { params });

    console.log("Processed LeadId:", leadId);
    console.log("Hunter.io result: ", enriched_res);
  } catch (err) {
    console.error("Error processing leads", err);
  }
}
