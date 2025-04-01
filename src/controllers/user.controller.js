import { Transaction } from "../models/transaction.model"
import { Budget } from "../models/budget.model.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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

const addExpense = async (req , res)=>{
  const {userText} = req.body
  if (!message) return res.status(400).json({ error: "Message is required" });
}