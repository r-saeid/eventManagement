import joi from "@hapi/joi";
import { roles } from "../utils/customeTypes";

export default {
  "/register": {
    body: {
      username: joi.string().min(6).max(150),
      password: joi.string().min(6).max(150).required(),
      role: joi.string().valid(...Object.values(roles)),
      firstName: joi.string().min(3).max(150).required(),
      lastName: joi.string().min(3).max(150).required(),
      email: joi
        .string()
        .email({ tlds: { allow: false } })
        .required(),
      birthDate: joi.date().raw().required(),
      picture: joi.string().min(6).max(150),
    },
  },
  "/edit/:id": {
    params: {
      id: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
    body: {
      username: joi.string().min(6).max(150),
      password: joi.string().min(6).max(150),
      role: joi.string().valid(...Object.values(roles)),
      firstName: joi.string().min(3).max(150),
      lastName: joi.string().min(3).max(150),
      birthDate: joi.number(),
      picture: joi.string().min(6).max(150),
    },
  },

  "/list": {},

  "/detail/:id": {
    params: {
      id: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },

  "/delete/:id": {
    params: {
      id: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
  "/login": {
    body: {
      email: joi
        .string()
        .email({ tlds: { allow: false } })
        .required(),
      password: joi.string().min(6).max(150).required(),
    },
  },
  "/logout": {},
};
