import { OpenAI } from "openai";
import dotenv from "dotenv";
import readlineSync from 'readline-sync';
import saveTransactionInDb from "./saveTransactionInDB.js";

dotenv.config({ path: "./.env" });

const client = new OpenAI({
	baseURL: "https://api.groq.com/openai/v1",
	apiKey: process.env.Groq_API_KEY,
})

const systemPrompt = `
You are an AI assistant that helps users log their expenses in MoneyMate.
Extract expense details (amount, category, description) from any user input format dynamically.
Once all details are extracted, log the expense in the database.

**Rules:**
1. **ALWAYS return a valid JSON response.**
2. **DO NOT include explanations, greetings, or extra text.**
3. **If amount, category, or description is missing, ask for it.**
4. **If the date is missing, automatically assume today's date.**
5. **Never ask for a date unless the user explicitly provides one.**
6. ** Never response like this : {"type": "input","prompt": "something something"}.**

Available Tool:
- function saveTransactionInDb(amount: number, type: string, category: string, description: string, date: string)
saveTransactionInDb is a function that logs expenses for users.

Only Valid Responses:
{"type": "action", "function": "saveTransactionInDb", "input": {"amount": 300, "type": "expense", "category": "Food", "description": "Lunch", "date": "2025-03-31"}}
{"type": "output", "user": "Your expense has been logged successfully."}

**Provide the structure of a JSON response. Example: { "name": "John", "age": 30, "city": "New York" }**

`;

const messages = [{ role: "system", content: systemPrompt }];
const tools = { saveTransactionInDb };

// auto prompting
while (true) {
  const query = readlineSync.question('>> ');
  messages.push({ role: "user", content: query });

  const chat = await client.chat.completions.create({
    model: "llama3-70b-8192",
    messages: messages,
    response_format: { type: "json_object" },  // Forces JSON output
    temperature: 0.2,         // Reduces randomness for structured output
  });

  const rawResponse = chat.choices[0].message.content;
  console.log("Raw API Response:", rawResponse);
  messages.push({ role: "assistant", content: rawResponse });

  const todayDate = new Date().toISOString().split("T")[0];

  try {
    const jsonMatches = rawResponse.match(/\{.*?\}/g);
    if (!jsonMatches) throw new Error("Invalid JSON response from AI");

    for (const jsonStr of jsonMatches) {
      const response = JSON.parse(jsonStr);

      if (response.type === "action" && response.function === "saveTransactionInDb") {
        const { amount, type, category, description, date } = response.input;
        console.log("Logging your expense...");
        const expenseDate = date || todayDate
        await saveTransactionInDb(amount, type, category, description, expenseDate);
        console.log("Your expense has been logged successfully.");
        break;
      }
    }
  } catch (error) {
    console.error("Error parsing AI response:", error);
  }
}
