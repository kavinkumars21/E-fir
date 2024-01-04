import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: String,
        faceDescriptors: Array,
    },
    { timestamps: true }
);

export const UserModel = new mongoose.model("Userimg", UserSchema);
