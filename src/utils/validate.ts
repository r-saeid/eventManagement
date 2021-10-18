import joi from "@hapi/joi";
import path from "path";
import fs from "fs";
import { Response, Request, NextFunction } from "express";

const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const path = req.route.path;
      const routeObject = schema[path];

      if (routeObject.body) {
        const validateSchema = joi.object(routeObject.body);
        const result = await validateSchema.validate(req.body);

        if (result.error) {
          res.status(500).json({ data: result.error?.details });
        }
        // if (result.errors) {
        //   res.status(500).json({ data: result.errors?.details });
        // }
      }
      if (routeObject.params) {
        const validateSchema = joi.object(routeObject.params);

        const result = await validateSchema.validate(req.params);

        if (result.error) {
          res.status(500).json({ data: result.error?.details });
        }
        // if (result.errors) {
        //   res.status(500).json({ data: result.errors?.details });
        // }
      }
      if (routeObject.query) {
        const validateSchema = joi.object(routeObject.query);

        const result = await validateSchema.validate(req.query);

        if (result.error) {
          res.status(500).json({ data: result.error?.details });
        }
        // if (result.errors) {
        //   res.status(500).json({ data: result.errors?.details });
        // }
      }
      next();
    } catch (error) {
      res.status(500).json({ data: error });
    }
  };
};

export default validate;
