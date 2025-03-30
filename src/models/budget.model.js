import mongoose , {Schema} from "mongoose";

const budgetSchema = new Schema(
  {
    creator:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    category:{
      type:String
    },
    amount:{
      type:String
    },
    startDate:{
      type:String
    }
  },{
    timestamps:true
  }
)

export const Budget = mongoose.model("Budget" , budgetSchema)