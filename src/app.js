import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN ,
  credentials:true
}))

app.use(express.json({limit:'16kb'}))   // setting a limit of json , like how much json data can be sent to backend 
app.use(express.urlencoded({limit:"16kb"}))   // setting a limit to url data 
app.use(cookieParser())  // by this we can access user cookies , and can do CRUD operation on it

app.get("/", (req , res)=>{
  return res.status(200).json({ message: "going good from money mate" });
})

export {app}
