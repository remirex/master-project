import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

import ProductService from '../../../services/admin/product/product';
import bodyAdminRequest from '../../requests/admin';
import { IProductCreateDTO } from '../../../interfaces/IProduct';

const route = Router();

export default (app: Router) => {
  app.use('/admin/product', route);

  const productServiceInstance = Container.get(ProductService);

  route.post(
    '/create',
    bodyAdminRequest.createProductSchema,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await productServiceInstance.createProduct(req.body as IProductCreateDTO);
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
      const response = await productServiceInstance.getAllProducts(page, limit);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;
      const response = await productServiceInstance.getProduct(productId);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });
};
