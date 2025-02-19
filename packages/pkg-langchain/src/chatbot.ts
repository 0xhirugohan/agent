import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseMessage, HumanMessage, SystemMessage, AIMessage, ToolMessage, MessageContent, MessageContentText, trimMessages } from "@langchain/core/messages";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { encodingForModel } from "@langchain/core/utils/tiktoken";
import { START, END, Annotation, MessagesAnnotation, StateGraph, MemorySaver } from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";

// Define the State
const GraphAnnotation = Annotation.Root({
	...MessagesAnnotation.spec,
	language: Annotation<string>(),
});

const llm = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-pro",
  temperature: 0,
  maxRetries: 2,
	apiKey: process.env.GOOGLE_API_KEY,
});

const promptTemplate = ChatPromptTemplate.fromMessages([
	[
		"system",
		"You talk like a pirate. Answer all questions to the best of your ability.",
	],
	[
		"placeholder",
		"{messages}",	
	],
]);

const promptTemplate2 = ChatPromptTemplate.fromMessages([
	[
		"system",
		"You are a helpful assistant. Answer all questions to the best of your ability in {language}."
	],
	[
		"placeholder",
		"{messages}"
	],
]);

const messages = [
	new SystemMessage("you're a good assistant"),
	new HumanMessage("hi! i'm bob"),
	new AIMessage("hi!"),
	new HumanMessage("I like vanilla ice cream"),
	new AIMessage("nice"),
	new HumanMessage("whats 2 + 2"),
	new AIMessage("4"),
	new HumanMessage("thanks"),
	new AIMessage("no problem"),
	new HumanMessage("having fun"),
	new AIMessage("yes!"),
];

const callModel = async (state: typeof MessagesAnnotation.State) => {
	const response = await llm.invoke(state.messages);
	return { messages: response };
};

const callModel2 = async (state: typeof MessagesAnnotation.State) => {
	const prompt = await promptTemplate.invoke(state);
	const response = await llm.invoke(prompt);
	// update message history with response
	return { messages: [response] };
};

const callModel3 = async (state: typeof GraphAnnotation.State) => {
	const prompt = await promptTemplate2.invoke(state);
	const response = await llm.invoke(prompt);
	return { messages: [response] };
};

const callModel4 = async (state: typeof GraphAnnotation.State) => {
	const trimmedMessage = await trimmer.invoke(state.messages);
	const prompt = await promptTemplate2.invoke({
		messages: trimmedMessage,
		language: state.language,
	});
	const response = await llm.invoke(prompt);
	return { messages: [response] };
};

const testMessages = [
  new SystemMessage("you're a good assistant"),
  new HumanMessage("hi! I'm bob"),
  new AIMessage("hi!"),
  new HumanMessage("I like vanilla ice cream"),
  new AIMessage("nice"),
  new HumanMessage("whats 2 + 2"),
  new AIMessage("4"),
  new HumanMessage("thanks"),
  new AIMessage("no problem!"),
  new HumanMessage("having fun?"),
  new AIMessage("yes!"),
];

const trimmedMessage = await trimMessages(testMessages, {
	maxToken: 100,
	// strategy: "last",
	// tokenCounter: (msgs) => msgs.length,
	tokenCounter: () => 1,
	// includeSystem: true,
	// allowPartial: false,
	// startOn: [HumanMessage],
	// endOn: [AIMessage],
});

console.log(
  trimmedMessage
    .map((x) =>
      JSON.stringify(
        {
          role: x._getType(),
          content: x.content,
        },
        null,
        2
      )
    )
    .join("\n\n")
);

// const chain = trimmer.pipe(llm);
// const trimmedMessage = await trimmer.invoke(messages);
console.log({ trimmedMessage });
console.dir(trimmedMessage, { depth: null });

/*

const config = { configurable: { thread_id: uuidv4() } };

// define a new graph
const workflow = new StateGraph(MessagesAnnotation)
	.addNode("model", callModel)
	.addEdge(START, "model")
	.addEdge("model", END);

const workflow2 = new StateGraph(MessagesAnnotation)
	.addNode("model", callModel2)
	.addEdge(START, "model")
	.addEdge("model", END);

const workflow3 = new StateGraph(GraphAnnotation)
	.addNode("model", callModel3)
	.addEdge(START, "model")
	.addEdge("model", END);

const workflow4 = new StateGraph(GraphAnnotation)
	.addNode("model", callModel4)
	.addEdge(START, "model")
	.addEdge("model", END);

// add memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });
const app2 = workflow2.compile({ checkpointer: new MemorySaver() });
const app3 = workflow3.compile({ checkpointer: new MemorySaver() });
const app4 = workflow4.compile({ checkpointer: new MemorySaver() });

const input = [
	{
		role: "user",
		content: "Hi! I'm Bob.",
	},
];
const output = await app.invoke({ messages: input }, config);
console.log(output.messages[output.messages.length - 1]);

const input2 = [
	{
		role: "user",
		content: "What's my name?",
	},
];
const output2 = await app.invoke({ messages: input2 }, config);
console.log(output2.messages[output2.messages.length - 1]);

const config2 = { configurable: { thread_id: uuidv4() } };
const input3 = [
	{
		role: "user",
		content: "What's my name?",
	},
];
const output3 = await app.invoke({ messages: input3 }, config2);
console.log(output3.messages[output3.messages.length - 1]);

const config3 = { configurable: { thread_id: uuidv4() } };
const input4 = [
	{
		role: "user",
		content: "Hi! I'm Jim.",
	},
];
const output5 = await app2.invoke({ messages: input4 }, config3);
console.log(output5.messages[output5.messages.length - 1]);

const config4 = { configurable: { thread_id: uuidv4() } };
const input6 = {
	messages: [
		{
			role: "user",
			content: "Hi im bob",
		},
	],
	language: "Spanish", // can be omitted once its already persisted and no longer wanted to be overriden
};
const output7 = await app3.invoke(input6, config4);
console.log(output7.messages[output7.messages.length - 1]);

const config5 = { configurable: { thread_id: uuidv4() } };
const input8 = {
	messages: [...messages, new HumanMessage("What is my name?")],
	language: "English",
};

const output9 = await app4.invoke(input8, config5);
console.log(output9.messages[output9.messages.length - 1]);
*/
