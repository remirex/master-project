import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

import AttributeService from '../../../services/admin/attribute/attribute';
import bodyAdminRequest from '../../requests/admin';
import { IAttributeCreateDTO } from '../../../interfaces/IAttribute';

const route = Router();

export default (app: Router) => {
  app.use('/admin/attribute', route);

  const attributeServiceInstance = Container.get(AttributeService);

  route.post(
    '/create',
    bodyAdminRequest.createAttributeSchema,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await attributeServiceInstance.createAttribute(req.body as IAttributeCreateDTO);
        return res.status(201).json(response);
      } catch (err) {
        return next(err);
      }
    },
  );
};
