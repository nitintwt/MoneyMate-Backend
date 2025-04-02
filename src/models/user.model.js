import mongoose , {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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
    tokens:{
      type:String
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
    ],
    subscriptions:[
      {
        type:Schema.Types.ObjectId,
        ref:'Subscription'
      }
    ]
  },
  {
    timestamps: true
  }
)

// here we care encrypting our password just brfore saving the user data, using pre hook of mongoose
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();  // if the password is not modified , just direct save the data without encrypting

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      name:this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

export const User = mongoose.model("User" , userSchema)