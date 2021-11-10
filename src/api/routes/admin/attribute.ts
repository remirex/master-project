import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

import AttributeService from '../../../services/admin/attribute/attribute';
import bodyAdminRequest from '../../requests/admin';
import { IAttributeCreateDTO } from '../../../interfaces/IAttribute';
import { IAttributeUpdateDTO } from '../../../interfaces/IAttribute';

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

  route.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(<string>req.query.page);
      const limit = parseInt(<string>req.query.limit);
      const response = await attributeServiceInstance.getAllAttributes(page, limit);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attributeId = req.params.id;
      const response = await attributeServiceInstance.GetAttribute(attributeId);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.put(
    '/update/:id',
    bodyAdminRequest.updateAttributeSchema,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const attributeId = req.params.id;
        const response = await attributeServiceInstance.updateAttribute(attributeId, req.body as IAttributeUpdateDTO);
        return res.status(200).json(response);
      } catch (err) {
        return next(err);
      }
    },
  );

  route.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attributeId = req.params.id;
      const response = await attributeServiceInstance.deleteAttribute(attributeId);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });
};
