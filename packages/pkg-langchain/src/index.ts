import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0,
  maxRetries: 2,
	apiKey: process.env.GOOGLE_API_KEY,
});

const systemTemplate = "Translate the following from English into {language}";
const promptTemplate = ChatPromptTemplate.fromMessages([
 	SystemMessagePromptTemplate.fromTemplate(systemTemplate),
	HumanMessagePromptTemplate.fromTemplate("{text}"),
]);
const promptValue = await promptTemplate.invoke({
	language: "spanish",
	text: "hi!",
});

console.dir(promptValue, { depth: null });

/*
const messages = [
	[
    "system",
    "You are a helpful assistant that translates English to French. Translate the user sentence.",
  ],
  ["human", "I love programming."],
	
	new SystemMessage("Use the following as an idea to write a 20 line of poem"),
	new HumanMessage("hi!"),
];
*/

// const aiMsg = await llm.invoke(promptValue);

const stream = await llm.stream(promptValue);
const chunks = [];
for await (const chunk of stream) {
	chunks.push(chunk);
	console.log(`${chunk.content}|`);
}

console.dir(chunks, { depth: null });
