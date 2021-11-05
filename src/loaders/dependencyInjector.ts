import { Container } from 'typedi';

import LoggerInstance from './logger';
import PaginateService from '../services/paginate';

export default ({ mongoConnection, models }: { mongoConnection: any; models: { name: string; model: any }[] }) => {
  try {
    models.map(m => {
      Container.set(m.name, m.model);
    });

    Container.set('logger', LoggerInstance);

    Container.set('pagination', PaginateService);
  } catch (err) {
    LoggerInstance.error('Error on dependency injector loader: ', err);
    throw err;
  }
};
