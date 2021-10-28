import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../../middlewares';

export function createCategorySchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
  });
  middleware.validation(req, res, next, schema);
}
