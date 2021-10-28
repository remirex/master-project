import { Router } from 'express';

import categories from './routes/admin/categories';

export default () => {
  const app = Router();

  // admin routes
  categories(app);

  return app;
};
