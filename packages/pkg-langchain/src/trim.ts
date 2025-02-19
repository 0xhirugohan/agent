import {
	AIMessage,
	HumanMessage,
	SystemMessage,
	trimMessages,
} from "@langchain/core/messages";
// import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const messages = [
	new SystemMessage("you're a good assistant, you always respond with a joke."),
	new HumanMessage("i wonder why it's called langchain"),
	new AIMessage("Well, I guess they thought \"WordRope\" and \"SentenceString\" just didn't have the same ring to it!"),
	new HumanMessage("and who is harrison chasing anyways"),
	new AIMessage("Hmmm let me think.\n\nWhy, he's probably chasing after the last cup of coffee in the office!"),
	new HumanMessage("what do you call a spechless parrot"),
];

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

const trimmed = await trimMessages(testMessages, {
	maxTokens: 45,
	strategy: "last",
	// tokenCounter: new ChatOpenAI({ modelName: "gpt-4" }),
	tokenCounter: new ChatGoogleGenerativeAI({
		model: "gemini-2.0-flash",
		apiKey: process.env.GOOGLE_API_KEY,
	}),
});

console.log(
	trimmed
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
