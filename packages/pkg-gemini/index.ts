/*
import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "";

const GEMINI_MODEL = {
	GEMINI_2_0_FLASH_LITE_PREVIEW: "gemini-2.0-flash-lite-preview-02-05",
	GEMINI_2_0_FLASH: "gemini-2.0-flash",
};

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL.GEMINI_2_0_FLASH_LITE_PREVIEW });

const prompt = "Explain how AI works";
const result = await model.generateContent(prompt);
console.log(result.response.text());
*/

const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "";
const GEMINI_MODEL = {
	GEMINI_2_0_FLASH_LITE_PREVIEW: "gemini-2.0-flash-lite-preview-02-05",
	GEMINI_2_0_FLASH: "gemini-2.0-flash",
};
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL.GEMINI_2_0_FLASH_LITE_PREVIEW}:streamGenerateContent?alt=sse&key=${GOOGLE_GEMINI_API_KEY}`, {
	method: "POST",
	body: JSON.stringify({
		contents: [
			{
				parts: [
					{
						text: "Explain how AI works",
					},
				],
			}
		],
	}),
	headers: {
		"Content-Type": "application/json",
	},
});

for await (const chunk of response.body) {
	const jsonString = Buffer.from(chunk).toString('utf8');
	const parsedData = JSON.parse(jsonString.slice(5));
	console.dir(parsedData, { depth: null });
}
/*
console.log(response.status);
const json = await response.json();
console.dir(json, { depth: null });
const candidates = json.candidates;
console.dir(candidates, { depth: null });
*/
