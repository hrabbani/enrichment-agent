import { SQSEvent, Context, SQSHandler, SQSRecord } from "aws-lambda";

export const enrichmentHandler: SQSHandler = async (
  event: SQSEvent,
  context: Context
): Promise<void> => {
  for (const message of event.Records) {
    await processLeadAsync(message);
  }
  console.log("Done processing leads");
};

async function processLeadAsync(message: SQSRecord): Promise<any> {
  try {
    console.log(`Processed message ${message.body}`);
    await Promise.resolve(1);
  } catch (err) {
    console.error("Error processing leads", err);
  }
}
