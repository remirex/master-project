import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../../middlewares';

export function createProductSchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    price: joi.number(),
    countInStock: joi.number(),
    category: joi.string().required(),
    brand: joi.string().required(),
  });
  middleware.validation(req, res, next, schema);
}
