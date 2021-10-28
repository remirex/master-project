import mongoose from 'mongoose';
import { ICategory } from '../interfaces/ICategory';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  slug: {
    type: String,
    required: true,
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
  icon: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ICategory & mongoose.Document>('Category', categorySchema);
