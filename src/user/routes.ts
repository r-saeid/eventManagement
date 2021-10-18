import express from "express";
import * as controller from "./controller";
import validate from "../utils/validate";
import joiSchema from "./joiSchema";
import authentication from "../middleware/authMiddleeware";
import { uploadSinglePicture } from "../utils/fileHandler";

// router.use(validate(joiSchema));

const router = express.Router();
router
  .post("/register", validate(joiSchema), controller.register)
  .put("/edit/:id", authentication, validate(joiSchema), controller.edit)
  .get("/list", authentication, validate(joiSchema), controller.list)
  .get("/detail/:id", authentication, validate(joiSchema), controller.detail)
  .delete("/delete/:id", authentication, validate(joiSchema), controller.del)
  .post("/login", validate(joiSchema), controller.login)
  .get("/logout", authentication, validate(joiSchema), controller.logout)
  .post(
    "/upload",
    authentication,
    uploadSinglePicture(),
    controller.uploadImage
  );

export default router;
