import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IBrand } from '../../interfaces/IBrand';

declare global {
  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type BrandModel = Model<IBrand & Document>;
  }
}
