import { Transaction } from "../models/transaction.model.js"

const saveTransactionInDb = async (amount , type , category , description , date)=>{
  console.log(amount , type , category, description , date)
  try {
    const transaction = await Transaction.create({
      amount:amount,
      type:type,
      category:category,
      description:description,
      date:date
    })
  } catch (error) {
    console.log("Something went wrong")
  }

}

export default saveTransactionInDb