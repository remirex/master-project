import mongoose from 'mongoose';
import { IBrand } from '../interfaces/IBrand';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
    },
    // logo: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export default mongoose.model<IBrand & mongoose.Document>('Brand', brandSchema);
