import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import CategoriesService from '../../../services/category';
import { ICreateCategoryDTO, IUpdateCategoryDTO } from '../../../interfaces/ICategory';
import bodyAdminRequest from '../../requests/admin';

const route = Router();

export default (app: Router) => {
  app.use('/admin/category', route);

  const logger: Logger = Container.get('logger');
  const categoryServiceInstance = Container.get(CategoriesService);

  route.post(
    '/create',
    bodyAdminRequest.createCategorySchema,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await categoryServiceInstance.createCategory(req.body as ICreateCategoryDTO);
        return res.status(201).json(response);
      } catch (err) {
        return next(err);
      }
    },
  );

  route.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await categoryServiceInstance.getAllCategories();
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = req.params.id;
      const response = await categoryServiceInstance.getCategory(categoryId);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.put(
    '/update/:id',
    bodyAdminRequest.updateCategorySchema,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const categoryId = req.params.id;
        const response = await categoryServiceInstance.updateCategory(categoryId, req.body as IUpdateCategoryDTO);
        console.log(req.body);
        return res.status(200).json(response);
      } catch (err) {
        return next(err);
      }
    },
  );

  route.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = req.params.id;
      const response = await categoryServiceInstance.deleteCategory(categoryId);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });
};
