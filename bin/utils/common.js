"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeChangeLog = summarizeChangeLog;
const axios_1 = __importDefault(require("axios"));
const API_KEY = process.env.API_KEY;
const MODEL = "mistralai/mistral-7b-instruct";
async function summarizeChangeLog(changelog) {
    if (!API_KEY) {
        throw new Error("Missing API key in environment for summarization.");
    }
    const systemPrompt = "You are an assistant that helps summarize Git commit logs into a changelog.";
    const userPrompt = `Please summarize the following git commit logs into a customer-facing changelog.
                        Be sure to highlight the key feature changes for the changes. The feature changes should only
                        be relevant to what users care about. \n${changelog}`;
    const response = await axios_1.default.post("https://openrouter.ai/api/v1/chat/completions", {
        model: MODEL,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
    }, {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        }
    });
    return response.data.choices[0].message.content.trim();
}
