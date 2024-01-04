import mongoose from "mongoose";

const FirSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: Number,
        required: true,
    },
    fathername: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    photoURL:{
        type: String,
        required: true
    },
    photoPublicID:{
        type: String,
        required: true
    },
    faceDescriptor: {
        type: String,
        required: true
    },
    timeofrecord : {
        type: Date,
        default: new Date(0, 0, 0),
        required: true,
    },
},
    { timestamps: true }
);

export const FirModel = new mongoose.model("Fir", FirSchema);
