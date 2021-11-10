import mongoose from 'mongoose';
import slugify from 'slugify';

export function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export function splitStr(str: string, separator: string) {
  // Function to split string
  const string = str.split(separator);

  return string[string.length - 1];
}

export async function alreadyExist(model: mongoose.Model<any>, name: string, isUpdate: boolean) {
  const slug = slugify(name, { lower: true });
  const find = await model.findOne({ slug: slug });
  return find && !isUpdate;
}
