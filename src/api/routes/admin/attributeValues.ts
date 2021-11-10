import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

import AttributeValueService from '../../../services/admin/attributeValue/attributeValue';
import { IAttributeValueCreateDTO, IAttributeValueUpdateDTO } from '../../../interfaces/IAttributeValue';
import bodyAdminRequest from '../../requests/admin';
const route = Router();

export default (app: Router) => {
  app.use('/admin/attribute-value', route);

  const attributeValuesServiceInstance = Container.get(AttributeValueService);

  route.post(
    '/create',
    bodyAdminRequest.createAttributeValueSchema,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await attributeValuesServiceInstance.createAttributeValue(
          req.body as IAttributeValueCreateDTO,
        );
        return res.status(201).json(response);
      } catch (err) {
        return next(err);
      }
    },
  );

  route.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(<string>req.query.page);
      const limit = parseInt(<string>req.query.limit);
      const response = await attributeValuesServiceInstance.getAllAttributeValues(page, limit);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attributeValueId = req.params.id;
      const response = await attributeValuesServiceInstance.getAttributeValue(attributeValueId);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.put(
    '/update/:id',
    bodyAdminRequest.updateAttributeValueSchema,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const attributeValueId = req.params.id;
        const response = await attributeValuesServiceInstance.updateAttributeValue(
          attributeValueId,
          req.body as IAttributeValueUpdateDTO,
        );
        return res.status(200).json(response);
      } catch (err) {
        return next(err);
      }
    },
  );

  route.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attributeValueId = req.params.id;
      const response = await attributeValuesServiceInstance.deleteAttributeValue(attributeValueId);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });
};
