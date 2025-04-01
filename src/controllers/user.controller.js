import { Transaction } from "../models/transaction.model.js"
import { Budget } from "../models/budget.model.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import dotenv from "dotenv";
import saveTransactionInDb from "../services/saveTransactionInDB.js"
import { systemPrompt } from "../services/ai.service.js"
import { OpenAI } from "openai"

dotenv.config({ path: "./.env" });

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

const allExpense = async (req , res)=>{
  const userId = req.query.userId

  try {
    const user = await User.findById(userId)

    if(!user){
      return res.status(404).json({message:"User doesn't exist"})
    }
  
    const expenses = await Transaction.find({creator:userId , type:"expense"})

    return res.status(201).json(new ApiResponse( 200 , {expenses}, "Expenses fetched successfully"))
  } catch (error) {
    console.log("Something went wrong while fetching your transactions")
  }

}

const allIncome = async ( req , res)=>{
  const userId = req.query.userId

  try {
    const user = await User.findById(userId)

    if(!user){
      return res.status(404).json({message:"User doesn't exist"})
    }
  
    const expenses = await Transaction.find({creator:userId , type:"income"})

    return res.status(201).json(new ApiResponse( 200 , {expenses}, "Expenses fetched successfully"))
  } catch (error) {
    console.log("Something went wrong while fetching your transactions")
  }
}

const allBudget = async ( req , res)=>{
  const userId = req.query.userId

  try {
    const user = await User.findById(userId)

    if(!user){
      return res.status(404).json({message:"User doesn't exist"})
    }
  
    const expenses = await Budget.find({creator:userId})

    return res.status(201).json(new ApiResponse( 200 , {expenses}, "Budget fetched successfully"))
  } catch (error) {
    console.log("Something went wrong while fetching your budget")
  }
}

// instead of HTTP connection use websockets for better result and user experience
const addExpense = async (req , res)=>{
  const {userText , userId} = req.body
  console.log("userid" , userId)
  if (!userText) return res.status(400).json({ error: "Message is required" })

  const messages = [{ role: "system", content: systemPrompt }];
  messages.push({ role: "user", content: userText });

  try {
    const chat = await client.chat.completions.create({
      model: "llama3-70b-8192",
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const rawResponse = chat.choices[0].message.content;
    console.log("Raw API Response:", rawResponse);
    const response = JSON.parse(rawResponse);

    const todayDate = new Date().toISOString().split("T")[0];

    if (response.type === "action" && response.function === "saveTransactionInDb") {
      const { amount, type, category, description, date } = response.input;
      console.log("Logging your expense...");

      const expenseDate = date || todayDate;
      await saveTransactionInDb(amount, type, category, description, userId ,expenseDate);

      return res.status(200).json({ message: "Your expense has been logged successfully." });
    }

    if (response.type === "input") {
      return res.json({ message: response.prompt });
    }

    return res.status(400).json({ error: "Invalid AI response format." });

  } catch (error) {
    console.error("Something went wrong while adding expense", error);
    return res.status(500).json({message: "Something went wrong while adding your expense" });
  }
}

export {addExpense , allBudget , allExpense}