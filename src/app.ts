import runSingleRun from "./utils/singleRun";
runSingleRun();
import express, { Router, Request, Response, NextFunction } from "express";
import cors from "cors";
import { rootRouter } from "./routes";
import { requestLogger } from "./utils/requestLogger";
import MongooseConnect from "./utils/db";
import config from "./utils/config";
import { number } from "@hapi/joi";

const app = express();

MongooseConnect.connection();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use("/", rootRouter);

app.listen(config.port, () => {
  console.log(`App running on port ${config.port}`);
});

export { app };
