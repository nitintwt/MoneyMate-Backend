import connectDB from "../db/index.js"
import { Transaction } from "../models/transaction.model.js"


const saveTransactionInDb = async (amount , type , category , description , userId)=>{
  console.log(amount , type , category, description , date)
  try {
    const transaction = await Transaction.create({
      amount:amount,
      type:type,
      category:category,
      description:description,
      date:date,
      creator:userId
    })
    console.log("Transaction saved:");
    return transaction;
  } catch (error) {
    console.log("Something went wrong", error)
  }

}

export default saveTransactionInDb