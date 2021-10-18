import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { verifyToken } from "../utils/authMethods";

const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["x-auth-token"];
    if (!token) {
      res
        .status(401)
        .json({ data: "Authorization failed. Token not provided" });
      return;
    }

    const data: any = await verifyToken(token);

    const user = await mongoose.connection.db.collection(
      "users",
      async (error, users) => {
        const user = await users.findOne({
          _id: mongoose.Types.ObjectId(data.userId),
        });
        if (user.token !== token) {
          res
            .status(401)
            .json({ data: "Authorization failed. Please login again" });
        } else {
          req.userId = data.userId;
          next();
        }
      }
    );
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

export default authentication;
