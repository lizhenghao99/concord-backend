import * as Joi from 'joi';

export const configSchema = Joi.object({
  PORT: Joi.number().default(8000),
  NODE_ENV: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
});
