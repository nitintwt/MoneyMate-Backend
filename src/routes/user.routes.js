import { Router } from "express";
import { addExpense, allBudget, allExpense } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.route("/addExpense").post(addExpense)
userRouter.route("/allExpense").get(allExpense)
userRouter.route("/allBudget", allBudget)


export default userRouter