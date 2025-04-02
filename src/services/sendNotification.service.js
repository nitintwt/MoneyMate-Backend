import {Queue, tryCatch} from "bullmq"
import { Subscription } from "../models/subscription.model.js"

const emailQueue = new Queue("subtrack-email-queue" , {
  connection: {
    host:process.env.AIVEN_HOST,
    port:26644,
    username:process.env.AIVEN_USERNAME,
    password:process.env.AIVEN_PASSWORD ,
  },
})

const sendNotfication = async ({subscriptionId})=>{
  console.log(subscriptionId)
  try {
    const subscription = await Subscription.findById(subscriptionId).populate('creator', "name email")
    const job =await emailQueue.add(`${subscription._id}`, {email:subscription.creator.email , name:subscription.creator.name , service:subscription.service , amount:subscription.amount})
    console.log("job",job)
  } catch (error) {
    console.log("Something went wrong while sending email" , error)
  }
}

export default sendNotfication