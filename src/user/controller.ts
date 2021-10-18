import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "./model";
import { hashPassword, comparePassword } from "../utils/authMethods";
import { signToken } from "../utils/authMethods";
import Event from "../event/model";
//Add new User
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const oldUser: any = await User.findOne({
      username: req.body.username,
    }).exec();

    if (oldUser) {
      res
        .status(409)
        .json({ data: "The user with this username is already exist" });
      return;
    }

    const newUser = new User(req.body);
    newUser._id = new mongoose.Types.ObjectId();
    newUser.password = await hashPassword(newUser.password);
    const result = await newUser.save();

    const token = await signToken({ userId: newUser._id });
    await User.updateOne({ _id: newUser._id }, { $set: { token } });
    res.status(200).json({ data: result, token });
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

// Edit User
export const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const editedUser: any = req.body;

    const oldUser: any = await User.findOne({ _id: userId }).exec();

    if (!oldUser) {
      res.status(404).json({ data: "The user is not found" });
      return;
    }

    // let query={$set:oldUser}

    for (let key in editedUser) {
      oldUser[key] = editedUser[key];
    }

    const result = await User.updateOne({ _id: userId }, { $set: oldUser });
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

// List of all user
export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await User.find().exec();

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

// Details of user
export const detail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      res.status(404).json({ data: "The user is not found" });
      return;
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

//Delete user
export const del = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      res.status(404).json({ data: "The user is not found" });
      return;
    }

    const product: any = await Event.findOne({
      sellerId: req.params.id,
    }).exec();
    if (product) {
      res
        .status(424)
        .json({ error: "The user can not be deleted because it has paroduct" });
      return;
    }

    const result = await User.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inputData: any = req.body;

    const loginUser: any = await User.findOne({
      email: inputData.email,
    }).exec();
    if (!loginUser) {
      res.status(404).json({ data: "The user is not found" });
      return;
    }

    const validCredential = await comparePassword(
      inputData.password,
      loginUser.password
    );

    if (validCredential) {
      const token = await signToken({ userId: loginUser._id });
      res.status(200).json({ data: { user: loginUser, token: token } });
      await User.updateOne({ email: inputData.email }, { $set: { token } });
    } else {
      res.status(404).json({ data: "Incorrect email or password" });
      return;
    }
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.userId);

    await User.updateOne({ _id: req.userId }, { $set: { token: null } });
    res.status(200).json({ data: "Logout succes" });
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uploadFile = req.file;
    console.log(uploadFile);

    // check the existence of file
    if (!uploadFile) {
      res.status(500).json({ data: "Nothing Uploaded" });
    } else {
      const path = uploadFile.path;
      const patharray = path.split("media/");
      console.log(patharray[1]);

      await User.updateOne({ _id: req.userId }, { avatar: patharray[1] });

      const result = {
        avatar: patharray[1],
        mimetype: uploadFile.mimetype,
        size: uploadFile.size,
      };

      res.status(200).json({ data: "update success" });

      //TODO base64 and encryption
    }
  } catch (err) {
    res.status(500).json({ data: "update fail" });
  }
};
