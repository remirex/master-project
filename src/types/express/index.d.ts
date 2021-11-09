import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IBrand } from '../../interfaces/IBrand';
import { ICategory } from '../../interfaces/ICategory';
import { IProduct } from '../../interfaces/IProduct';
import { IAttribute } from '../../interfaces/IAttribute';

declare global {
  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type BrandModel = Model<IBrand & Document>;
    export type CategoryModel = Model<ICategory & Document>;
    export type ProductModel = Model<IProduct & Document>;
    export type AttributeModel = Model<IAttribute & Document>;
  }
}
