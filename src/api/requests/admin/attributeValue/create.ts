import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../../middlewares';

export function createAttributeValueSchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi.object({
    value: joi.string().required(),
    price: joi.boolean(),
    attribute: joi.string().required(),
  });
  middleware.validation(req, res, next, schema);
}
