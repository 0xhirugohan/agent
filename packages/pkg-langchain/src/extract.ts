import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  maxRetries: 2,
	apiKey: process.env.GOOGLE_API_KEY,
});

const promptTemplate = ChatPromptTemplate.fromMessages([
	SystemMessagePromptTemplate.fromTemplate(`
		You are an expert extraction algorithm.
		Only extract relevant information from the text.
		If you do not know the value of an attribute asked to extract, return null for the attribute's value.		
	`),
	HumanMessagePromptTemplate.fromTemplate("{text}"),
]);

const personSchema = z.object({
	name: z.optional(z.string()).describe("The name of the person"),
	hair_color: z.optional(z.string()).describe("The color of the person's hair if known"),
	height_in_meters: z.optional(z.string()).describe("Height measured in meters"),
});

const dataSchema = z.object({
	people: z.array(personSchema).describe("Extracted data about people"),
});

const structuredLLM = llm.withStructuredOutput(dataSchema, {
	name: "person",
});

const prompt = await promptTemplate.invoke({
	text: "Alan Smith is 6 feet tall and has black hair color. My name is Jeff, my hair is blond and i am 6 feet tall. Anna has the same color hair as me."
});

const promptValue = await structuredLLM.invoke(prompt);

console.dir(promptValue, { depth: null });
