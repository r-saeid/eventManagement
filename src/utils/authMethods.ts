import bcrypt from "bcrypt";
import config from "./config";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(Number(config.JWT.salt));
  const hashedPasswod = await bcrypt.hash(password, salt);

  return hashedPasswod;
};

export const comparePassword = async (
  inputPassword: string,
  savedPassword: string
): Promise<boolean> => {
  const validPassword = await bcrypt.compare(inputPassword, savedPassword);

  return validPassword;
};

export const signToken = async (data: object) => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(data, config.JWT.JWTPrivateKey, {
        subject: "login",
        issuer: "eventManagement",
        audience: "app",
      });

      resolve(token);
    } catch (error) {
      reject(error);
    }
  });
};

export const verifyToken = (token: any) => {
  return new Promise((resolve, reject) => {
    try {
      const decodedData: any = jwt.verify(token, config.JWT.JWTPrivateKey, {
        audience: "app",
        subject: "login",
        maxAge: config.JWT.maxAge,
        issuer: "eventManagement",
      });

      resolve(decodedData);
    } catch (error) {
      console.log(error);

      reject(error);
    }
  });
};
