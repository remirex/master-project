import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../../middlewares';

export function updateCategorySchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    menu: joi.boolean(),
    featured: joi.boolean(),
  });
  middleware.validation(req, res, next, schema);
}
