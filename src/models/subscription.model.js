import mongoose , {Schema} from "mongoose";

const subscriptionSchema = new Schema(
  {
    creator:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    service:{
      type:String
    },
    amount:{
      type:String
    },
    frequency:{
      type:String
    },
    lastRenewalDate:{
      type: String
    },
    isNotification:{
      type: Boolean,
      default:false
    },
    category:{
      type:String,
      default:"nan"
    }
  },{
    timestamps:true
  }
)

export const Subscription = mongoose.model("Subscription" , subscriptionSchema)