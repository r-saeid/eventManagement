import { Request, Response, NextFunction } from "express";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = new Date().getTime();
  res.on("finish", () => {
    const responseTime = new Date().getTime() - startTime;
    console.log(
      "\x1b[36m%s\x1b[0m",
      `Request:  ${req.method} ${req.originalUrl} , reponse time:${responseTime} ms,  with status:${res.statusCode}`
    );
  });

  next();
};

export { requestLogger };
