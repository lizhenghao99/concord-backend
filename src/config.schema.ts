import * as Joi from 'joi';

export const configSchema = Joi.object({
    PORT: Joi.number().default(8000),
    NODE_ENV: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
    REDIS_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    NETFLIX_API_HOST: Joi.string().required(),
    NETFLIX_API_KEY: Joi.string().required(),
    FRONTEND_BASE_URL: Joi.string().required(),
});
