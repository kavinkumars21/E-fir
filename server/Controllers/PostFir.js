import cloudinary from "../Config/cloudinary.js";
import { FirModel } from "../Schema/FirSchema.js";

export const Postefir = async (req, res) => {

    const Image = req.body.Image;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const Name = firstName+lastName;

    const uploadedResponse = await cloudinary.v2.uploader.upload(Image, {
        folder: `FirImage/${Name}`,
        use_filename: true
    });
    
    const fir = new FirModel({
        firstName: firstName,
        lastName: lastName,
        age: req.body.age,
        address: req.body.address,
        phonenumber: req.body.phonenumber,
        // fathername: req.body.fathername,
        section: req.body.section,
        photoURL: uploadedResponse.secure_url,
        photoPublicID: uploadedResponse.public_id,
        faceDescriptor: req.body.faceDescriptor,
        timeofrecord: req.body.timeofrecord,
    });
    fir.save().then(() => {
        res.send({
            status: 200,
            message: "First Information Record created successfully",
        });
    }).catch((err) => {
        res.send(err);
    })
};
