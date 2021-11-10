import { Router } from 'express';

import categories from './routes/admin/categories';
import brands from './routes/admin/brands';
import products from './routes/admin/products';
import attributes from './routes/admin/attribute';

export default () => {
  const app = Router();

  // admin routes
  categories(app);
  brands(app);
  products(app);
  attributes(app);

  return app;
};
