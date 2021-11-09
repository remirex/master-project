import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../../middlewares';

export function createAttributeSchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi.object({
    name: joi.string().required(),
    code: joi.string().required(),
    frontend_type: joi.string().required(),
  });
  middleware.validation(req, res, next, schema);
}
