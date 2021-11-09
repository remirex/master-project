import mongoose from 'mongoose';
import { IProduct } from '../interfaces/IProduct';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
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
    richDescription: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

productSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

productSchema.pre('save', async function (done) {
  const slugProductName = slugify(this.get('name'), { lower: true });
  this.set('slug', slugProductName);
  done();
});

export default mongoose.model<IProduct & mongoose.Document>('Product', productSchema);
