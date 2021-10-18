import express, { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

//create a folder

const generateFolder = async () => {
  let rootPath: string;
  rootPath = path.resolve(path.join("..", "media", "users"));
  let userFolder = "ev_";
  uuidv4()
    .toString()
    .split("-")
    .map((i) => {
      userFolder = userFolder + i;
    });

  const finalPath = path.join(rootPath, userFolder);
  return finalPath;
};

//check the existence of create directory

const makeDir = async (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const folderPath = await generateFolder();
    fs.stat(folderPath, async (err, stats) => {
      if (err) {
        // Directory doesn't exist or something.
        console.log("User Path doesn't exist, so I made the folder ");
        fs.mkdir(folderPath, { recursive: true }, (err) => {
          resolve(path.resolve(folderPath));
        });
      } else {
        if (!stats.isDirectory()) {
          console.log(new Error("path is not a directory!"));
          reject(new Error("path is not a directory!"));
        } else {
          console.log("the path already exists");
          resolve(path.resolve(folderPath));
        }
      }
    });
  });
};

//multer initials

const storage = multer.diskStorage({
  destination: function async(req: any, file: any, cb: any) {
    makeDir().then((res) => {
      cb(null, res);
    });
  },
  filename: function (req: any, file: Express.Multer.File, cb: any) {
    let name = "ufi_";
    uuidv4()
      .toString()
      .split("-")
      .map((i) => {
        name = name + i;
      });
    cb(null, name + "_" + Date.now() + path.extname(file.originalname));
  },
});

//check the extension of FILE with setting allowed_img_ext
const checkFileType = (
  req: any,
  file: Express.Multer.File,
  cb: any,
  allowed_ext: string[]
) => {
  if (file) {
    if (allowed_ext.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      console.log("The Type of file not allowed.");
      cb(new Error("The Type of file not allowed."), false);
    }
  }
};

//upload single picture

export const uploadSinglePicture = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("in the file manager uploader");
    const upload = await multer({
      storage,
      limits: { fileSize: 1024 * 1024 * 2 },
      fileFilter: function (req, file, cb) {
        checkFileType(req, file, cb, [".jpg", ".png"]);
      },
    }).single("fileUpload");

    upload(req, res, (err: any) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      }
      return next();
    });
  };
};
