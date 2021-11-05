import mongoose from 'mongoose';
import slugify from 'slugify';

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
    },
    logo: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

brandSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

brandSchema.pre('save', async function (done) {
  const slugBrandName = slugify(this.get('name'), { lower: true });
  this.set('slug', slugBrandName);
  done();
});

export default mongoose.model<IBrand & mongoose.Document>('Brand', brandSchema);
