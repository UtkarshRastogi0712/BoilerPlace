import * as Joi from "joi";

const schema = Joi.object({
  entryPoint: Joi.string()
    .pattern(/^[a-zA-Z][a-zA-Z0-9-_.]*.js$/)
    .required()
    .max(255),
  entitties: Joi.object().keys(
    Joi.string()
      .pattern(/^[a-zA-Z][a-zA-Z0-9-_.]*.js$/)
      .required()
      .max(255)
  ),
});
