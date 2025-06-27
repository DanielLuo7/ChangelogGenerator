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
    const systemPrompt = `You are an assistant that helps summarize Git commit logs into a changelog. 
                          We want to prioritize key features that only users would care about.`;
    const userPrompt = `You are generating a customer-facing changelog from the following Git commit logs.

                        ### Strict Rules:
                        -  Only include features, improvements, or fixes that are meaningful to **end users**
                        -  Do NOT include commit hashes, developer notes, PR numbers, or internal technical changes
                        -  Never include lines like "[Commit: abc123]" or "Merge pull request"
                        -  Output must be **well-formatted Markdown**, with human-friendly descriptions
                        -  Never include any markdown links

                        ### Formatting Style:
                        - Group into sections like **"New Features"**, **"Improvements"**, or **"Fixes"**
                        - Each bullet point should be a clear, concise summary of one user-facing change
                        - No concluding paragraph is needed
                    
                        ### Git commit logs:
                        ${stripHashesFromChangeLog(changelog)}`;
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
    return cleanSummaryOutput(response.data.choices[0].message.content.trim());
}
function stripHashesFromChangeLog(changelog) {
    return changelog
        .replace(/\s*\([a-f0-9]{6,}\)/g, '') // strip hashes
        .replace(/^[-*]\s+/gm, '• ');
}
function cleanSummaryOutput(markdown) {
    return markdown
        // Remove markdown links e.g. [text](url)
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove trailing parentheticals like (some text) at end of line
        .replace(/(\s*\([^)]*\))(?=\s*[\n\r])/g, '')
        // Remove trailing parentheticals mid-line if you want to be more aggressive
        .replace(/\s*\([^)]*\)/g, '')
        // Normalize line endings
        .replace(/\r\n/g, '\n')
        // Remove extra spaces
        .replace(/[ \t]+$/gm, '')
        .trim();
}
