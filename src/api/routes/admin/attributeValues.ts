import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

import AttributeValueService from '../../../services/admin/attributeValue/attributeValue';
import { IAttributeValueCreateDTO } from '../../../interfaces/IAttributeValue';

const route = Router();

export default (app: Router) => {
  app.use('/admin/attribute-value', route);

  const attributeValuesServiceInstance = Container.get(AttributeValueService);

  route.post(
    '/create',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await attributeValuesServiceInstance.createAttributeValue(req.body as IAttributeValueCreateDTO);
        return res.status(201).json(response);
      } catch (err) {
        return next(err);
      }
    }
  );
}
