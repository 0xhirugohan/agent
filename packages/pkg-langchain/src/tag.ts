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

const taggingPrompt = ChatPromptTemplate.fromTemplate(
	`Extract the desired information from the following passage.

	Only extract the properties mentioned in the 'Classification' function.

	Passage:
	{input}
	`
);

const classificationSchema = z.object({
	sentiment: z.enum(["happy", "neutral", "sad"]).describe("The sentiment of the text"),
	aggressiveness: z.number().int().min(1).max(5).describe("How aggressive the text is, minimum is 1, and maximum is 5, the higher the number the more aggressive"),
	language: z.enum(["spanish", "english", "french", "german", "italian"]).describe("The language the text is written in"),
});

const llmWithStructuredOutput = llm.withStructuredOutput(classificationSchema, {
	name: "extractor",
});

const prompt1 = await taggingPrompt.invoke({
	input: "Estoy increiblemente contento de haberte conocido! Creo que seremos muy buenos amigos!"
});
const prompt2 = await taggingPrompt.invoke({
	input: "Estoy increiblemente contento de haberte conocido! Creo que seremos muy buenos amigos!"
});
const prompt3 = await taggingPrompt.invoke({
	input: "Estoy muy enojado con vos! Te voy a dar tu merecido!"
});
const prompt4 = await taggingPrompt.invoke({
	input: "Weather is ok here, I can go outside without much more than a coat"
});

const promptValue = await Promise.all([
	llmWithStructuredOutput.invoke(prompt1),
	llmWithStructuredOutput.invoke(prompt2),
	llmWithStructuredOutput.invoke(prompt3),
	llmWithStructuredOutput.invoke(prompt4),
]);

console.dir(promptValue, { depth: null });
