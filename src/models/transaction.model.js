import mongoose, {Schema} from "mongoose";

const transactionSchema = new Schema(
  {
    creator:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    type:{
      type:String
    },
    category:{
      type:String
    },
    amount:{
      type:String
    },
    description:{
      type:String
    },
    date:{
      type:String
    }
  },
  {
    timestamps:true
  }
)

export const Transaction = mongoose.model("Transaction" , transactionSchema)