import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

import middleware from '../../../middlewares';

export function updateAttributeSchema(req: Request, res: Response, next: NextFunction) {
  const schema = joi.object({
    name: joi.string().required(),
    code: joi.string().required(),
    frontend_type: joi.string().required(),
    is_filterable: joi.boolean(),
    is_required: joi.boolean(),
  });
  middleware.validation(req, res, next, schema);
}
