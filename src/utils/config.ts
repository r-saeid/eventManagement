import fs from "fs";

export default {
  port: Number(process.env.PORT) || 4000,
  mongoDB: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DATABASE,
    username: process.env.MONGO_USERNAME,
    pasword: process.env.MONGO_PASSWORD,
  },
  JWT: {
    JWTPrivateKey: fs.readFileSync(__dirname + "/keys/jwtKey.key", {
      encoding: "utf-8",
    }),
    salt: process.env.SALT,
    maxAge: "20d",
  },
  purchase: {
    allowedDeposit: [20, 5, 10, 50, 100],
  },
};
