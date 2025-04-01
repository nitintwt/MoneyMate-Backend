import razorpay from 'razorpay'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { User } from '../models/user.model.js'

dotenv.config({
  path:'./.env'
})

const createRazorpayInstance = ()=>{
  return new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
  })
}

const razorpayInstance = createRazorpayInstance()

const createOrder = async (req , res)=>{
  const {subscriptionId}= req.body
  let amount = 0;

  if ( subscriptionId == 1){
    amount = 9
  } else {
    amount = 89
  }

  // create an order with razorpay
  const options = {
    amount : amount * 84 * 100, // convert dollar into rupees and then for razorpay config multiply by 100
    currency: "INR",
    receipt: 'receipt_order_1',
  }

  try {
     razorpayInstance.orders.create(options, (err, order)=>{
      if(err){
        return res.status(500).json({message:"Something went wrong"})
      }
      return res.status(200).json(
        new ApiResponse(200 , order , "Successfully created your order" )
      )
    } )
  } catch (error) {
    return res.status(500).json({message:"Something went wrong"})
  }
}

const verifyPayment = async ( req , res)=>{
  const {orderId , paymentId , signature , userId}= req.body
  console.log(orderId , paymentId , signature , userId)

  const user = await User.findById(userId)
  user.razorpayId = orderId
  user.paidUser = true
  await user.save()

  //create hmac object 
  const hmac = crypto.createHmac("sha256" , process.env.RAZORPAY_KEY_SECRET)

  hmac.update(orderId + "|" + paymentId)
  const generatedSignature = hmac.digest("hex")

  if (generatedSignature === signature){
    return res.status(200).json(
      new ApiResponse(200 , null , "Payment Verified")
    )
  } else{
    return res.status(400).json(
      new ApiResponse(400 , null , "Payment not verified")
    )
  }
}

export {createOrder , verifyPayment}