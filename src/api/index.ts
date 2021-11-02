import { Router } from 'express';

import categories from './routes/admin/categories';
import brands from './routes/admin/brands';

export default () => {
  const app = Router();

  // admin routes
  categories(app);
  brands(app);

  return app;
};
