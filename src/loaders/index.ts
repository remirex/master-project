import expressLoader from './express';
import mongooseLoader from './mongoose';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';

export default async ({ expressApp }: any) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('DB loaded and connected!');

  // App models
  const userModel = {
    name: 'userModel',
    // Notice the require syntax and the '.default'
    model: require('../models/user').default,
  };

  const brandModel = {
    name: 'brandModel',
    model: require('../models/brand').default,
  };

  await dependencyInjectorLoader({
    mongoConnection,
    models: [userModel, brandModel],
  });
  Logger.info('Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded!');
};
