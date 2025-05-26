import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { createAISDKTools } from "@agentic/ai-sdk";
import { ExaClient } from "@agentic/exa";
import { FirecrawlClient } from "@agentic/firecrawl";

import dotenv from "dotenv";
dotenv.config();

export async function runResearchAgent(researchPrompt: string, leadInfo: any) {
  const exa = new ExaClient();
  const firecrawl = new FirecrawlClient();

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    tools: {
      ...createAISDKTools(exa),
      ...createAISDKTools(firecrawl),
    },
    temperature: 0,
    maxSteps: 10,
    system: `
      You are a web search assistant for enriching data about people and companies.
      Given info about a lead (name, company) and a prompt, use your available tools to fulfill the
      user request. The prompt will be given to you in the following format: 
      Lead Info: 
       --Name: (name of lead)
       --Company (company of lead)

      Research Prompt: (research prompt)

      Use the Exa search tool to find information from the web. 
      If asked to visit a specific url and provide information from that page/website, 
      start by calling the firecrawl_scrape_url tool. 
      If that tool doesn't give the required information, 
      call the firecrawl_crawl_url tool to crawl the rest of the website and find the desired information. 
      Always cite your sources and provide a comprehensive answer.
    `,
    prompt: `Lead Info: 
              --Name: ${leadInfo.name}
              --Company: ${leadInfo.company}

            Research Prompt: ${researchPrompt}`,

    onStepFinish({ toolCalls, finishReason }) {
      console.log("-------");
      console.log("Step finished...");
      console.log("Tool Calls:", toolCalls || "");
      console.log("Finish reason:", finishReason);
      console.log("-------");
    },
  });
  const toolCalls = result.steps.flatMap((step) => step.toolCalls);

  const toolResults = result.steps.flatMap((step: any) => {
    return (
      step.toolResults?.map((toolResult: any) => toolResult.result.results) ||
      [] ||
      []
    );
  });

  console.log(`Main result: ${result.text}`);
  console.log("Number of steps:", result.steps.length);
  console.log("Step toolresults:", toolResults);

  return result.text;
}
