import mongoose from 'mongoose';

const attributeValueSchema = new mongoose.Schema(
  {
    value: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    attribute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attribute',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

attributeValueSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
