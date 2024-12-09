import mongoose, { Schema, Document } from "mongoose";
import { Booking } from "../../../modules/booking/models/booking.model";

export interface ICourse extends Document {
  title: string;
  description: string;
  capacity: number;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    capacity: { type: Number, required: true },
  },
  { timestamps: true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

courseSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    await Booking.deleteMany({ course: this._id });
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Course = mongoose.model<ICourse>("Course", courseSchema);
