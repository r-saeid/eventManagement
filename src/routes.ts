import { Router } from "express";
import userRoute from "./user/routes";
import eventRoute from "./event/routes";

const rootRouter = Router();

rootRouter.use("/user", userRoute);
rootRouter.use("/event", eventRoute);

export { rootRouter };
