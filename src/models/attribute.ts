import mongoose from 'mongoose';

import { FrontendType } from '../enums/enums';
import { IAttribute } from '../interfaces/IAttribute';
import slugify from 'slugify';

const attributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    frontend_type: {
      type: String,
      required: true,
      enum: [FrontendType.TEXT, FrontendType.RADIO, FrontendType.TEXT_AREA, FrontendType.SELECT],
    },
    is_filterable: {
      type: Boolean,
      default: 0,
    },
    is_required: {
      type: Boolean,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

attributeSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

attributeSchema.pre('save', async function (done) {
  const slugAttributeName = slugify(this.get('code'), { lower: true });
  this.set('code', slugAttributeName);
  done();
});

export default mongoose.model<IAttribute & mongoose.Document>('Attribute', attributeSchema);
