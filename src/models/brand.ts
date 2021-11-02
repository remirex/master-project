import mongoose from 'mongoose';
import { IBrand } from '../interfaces/IBrand';
import slugify from 'slugify';

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
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
        delete ret._id;
      },
    },
  },
);

brandSchema.pre('save', async function (done) {
  const slugBrandName = slugify(this.get('name'), { lower: true });
  this.set('slug', slugBrandName);
  done();
});

export default mongoose.model<IBrand & mongoose.Document>('Brand', brandSchema);
