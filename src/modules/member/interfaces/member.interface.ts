import mongoose from "mongoose";
import { Role } from "./role.interface";

export interface IMember extends Document {
    _id: mongoose.Types.ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    birthday: Date;
    phonenumber: string;
    role: Role;
    comparePassword(candidatePassword: string): Promise<boolean>;
    createdAt?: Date;
    updatedAt?: Date;
  }
  