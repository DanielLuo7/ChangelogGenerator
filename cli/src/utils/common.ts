import axios from "axios";

const API_KEY = process.env.API_KEY;
const MODEL = "mistralai/mistral-7b-instruct"

export async function summarizeChangeLog(changelog: string) {
    if (!API_KEY) {
        throw new Error("Missing API key in environment for summarization.")
    }

    const systemPrompt = "You are an assistant that helps summarize Git commit logs into a changelog.";
    const userPrompt = `Please summarize the following git commit logs into a customer-facing changelog.
                        Be sure to highlight the key feature changes for the changes. The feature changes should only
                        be relevant to what users care about. \n${changelog}`;
    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: MODEL,
            messages: [
                { role: "system", content: systemPrompt},
                { role: "user", content: userPrompt },
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            }
        }
    )
    return response.data.choices[0].message.content.trim();
}
