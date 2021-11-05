import mongoose from 'mongoose';
import slugify from 'slugify';

import { ICategory } from '../interfaces/ICategory';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    menu: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

categorySchema.pre('save', async function (done) {
  const slugCatName = slugify(this.get('name'), { lower: true });
  this.set('slug', slugCatName);
  done();
});

export default mongoose.model<ICategory & mongoose.Document>('Category', categorySchema);
