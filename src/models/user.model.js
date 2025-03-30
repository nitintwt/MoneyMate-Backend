import mongoose , {Schema} from "mongoose";

const userSchema = new Schema(
  {
    name:{
      type:String,
    },
    email:{
      type:String,
      unique:true,
      index:true
    },
    password:{
      type:String
    },
    refreshToken:{
      type:String
    },
    paidUser:{
      type:Boolean,
      default: false,
    },
    razorpayId:{
      type : String,
      default: null,
    },
    budget:[
      {
        type:Schema.Types.ObjectId,
        ref:'Budget'
      }
    ],
    transactions:[
      {
        type:Schema.Types.ObjectId,
        ref:'Transaction'
      } 
    ]
  },
  {
    timestamps: true
  }
)

export const User = mongoose.model("User" , userSchema)