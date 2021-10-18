import express from "express";
import * as controller from "./controller";
import validate from "../utils/validate";
import joiSchema from "./joiSchema";
import authentication from "../middleware/authMiddleeware";

const router = express.Router();

router
  .post("/add", authentication, validate(joiSchema), controller.add)
  .put("/edit/:id", authentication, validate(joiSchema), controller.edit)
  .get("/list", authentication, validate(joiSchema), controller.list)
  .get("/detail/:id", authentication, validate(joiSchema), controller.detail)
  .delete("/delete/:id", authentication, validate(joiSchema), controller.del)
  .put(
    "/register/:id",
    authentication,
    validate(joiSchema),
    controller.register
  )
  .put(
    "/unregister/:id",
    authentication,
    validate(joiSchema),
    controller.unregister
  );

export default router;
