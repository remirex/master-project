import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import CategoriesService from '../../../services/admin/category/category';
import { ICreateCategoryDTO, IUpdateCategoryDTO } from '../../../interfaces/ICategory';
import bodyAdminRequest from '../../requests/admin';
import middleware from '../../middlewares';

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

  route.get('/all', async (req: Request, res: Response, next: NextFunction) => {
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

  route.put(
    '/image-upload/:id',
    middleware.fileUpload.single('image'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const fileName = req.file?.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        const categoryId = req.params.id;
        const response = await categoryServiceInstance.uploadCategoryImage(fileName, categoryId, basePath, req.file!);
        return res.status(200).json(response);
      } catch (err) {
        return next(err);
      }
    },
  );
};
