import mongoose from 'mongoose';

export function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export function splitStr(str: string, separator: string) {
  // Function to split string
  const string = str.split(separator);

  return string[string.length - 1];
}
