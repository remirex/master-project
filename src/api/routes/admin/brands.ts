import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import BrandService from '../../../services/admin/brand/brand';
import { IBrandCreateDTO, IBrandUpdateDTO } from '../../../interfaces/IBrand';
import bodyAdminRequest from '../../requests/admin';
import middleware from '../../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/admin/brand', route);

  const brandServiceInstance = Container.get(BrandService);

  route.post('/create', bodyAdminRequest.createBrandSchema, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await brandServiceInstance.createBrand(req.body as IBrandCreateDTO);
      return res.status(201).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await brandServiceInstance.getAllBrands();
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brandId = req.params.id;
      const response = await brandServiceInstance.getBrand(brandId);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.put(
    '/update/:id',
    bodyAdminRequest.updateBrandSchema,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const brandId = req.params.id;
        const response = await brandServiceInstance.updateBrand(brandId, req.body as IBrandUpdateDTO);
        return res.status(200).json(response);
      } catch (err) {
        return next(err);
      }
    }
  );

  route.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brandId = req.params.id;
      const response = await brandServiceInstance.deleteBrand(brandId);
      return res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  });

  route.put(
    '/image-upload/:id',
    middleware.fileUpload.single('brandLogo'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const fileName = req.file?.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/${req.file?.fieldname}/`;
        const brandId = req.params.id;
        const response = await brandServiceInstance.uploadBrandImage(fileName, brandId, basePath, req.file!);
        return res.status(200).json(response);
      } catch (err) {
        return next(err);
      }
    }
  );
};
