import { Route, Router } from "express";
import { deleteSubscription, getSubscriptions, getUserDetails, googleAuth, googleLogin, startNotification, stopNotification} from '../controllers/subscription.controller.js'

const subscriptionRouter = Router()

subscriptionRouter.route("/googleOAuth").get(googleAuth)
subscriptionRouter.route("/googleLogin").post(googleLogin)
subscriptionRouter.route("/subscriptions").get(getSubscriptions)
subscriptionRouter.route("/userDetails").get(getUserDetails)
subscriptionRouter.route("/subscriptiondel").delete(deleteSubscription)
subscriptionRouter.route("/startNotification").put(startNotification)
subscriptionRouter.route("/stopNotification").put(stopNotification)

export default subscriptionRouter