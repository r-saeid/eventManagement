import joi from "@hapi/joi";

export default {
  "/add": {
    body: {
      name: joi.string().min(3).max(150).required(),
      location: joi.string().min(3).max(150).required(),
      startDate: joi.number().positive().required(),
      endDate: joi.number().positive().required(),
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
      name: joi.string().min(3).max(150).required(),
      location: joi.string().min(3).max(150).required(),
      startDate: joi.number().positive().required(),
      endDate: joi.number().positive().required(),
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
  "/register/:id": {
    params: {
      id: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
  "/unregister/:id": {
    params: {
      id: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
};
