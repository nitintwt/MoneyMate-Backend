import { Router } from "express";
import { addExpense } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.route("/addExpense").post(addExpense)


export default userRouter