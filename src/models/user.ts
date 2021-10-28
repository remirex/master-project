import mongoose from 'mongoose';

import { UserRole, UserStatus } from '../enums/enums';
import Password from '../services/password';
import { IUser } from '../interfaces/IUser';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    acceptTerms: {
      type: Boolean,
      required: true,
    },
    verificationToken: {
      token: String,
      expires: Date,
    },
    verified: Date,
    resetToken: {
      token: String,
      expires: Date,
    },
    passwordReset: Date,
    role: {
      type: String,
      default: UserRole.GUEST,
      enum: [UserRole.GUEST, UserRole.ADMIN],
    },
    status: {
      type: String,
      default: UserStatus.INACTIVE,
      enum: [UserStatus.INACTIVE, UserStatus.BANNED, UserStatus.ACTIVE],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.virtual('isVerified').get(function (this: { verified: Date; passwordReset: Date }): boolean {
  return !!(this.verified || this.passwordReset);
});

export default mongoose.model<IUser & mongoose.Document>('User', userSchema);
