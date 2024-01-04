import { UserModel } from "../Schema/UserSchema.js";
import { faceapi } from './faceapi.js';
import { loadImage } from 'canvas'; 
import sharp from 'sharp';
import Blob from 'blob';
import { writeFile } from 'fs/promises';
// import blob from 'fetch-blob';

export const Postuser = async (req, res) => {

    try {
      const dataURItoBuffer = (dataURI) => {
        const base64Data = dataURI.split(',')[1];
        return Buffer.from(base64Data, 'base64');
      };

      const convertToJpeg = async (webpDataURI) => {
        const buffer = dataURItoBuffer(webpDataURI);
      
        const jpegBuffer = await sharp(buffer)
          .toFormat('jpeg') // Convert to JPEG
          .toBuffer();
      
        return jpegBuffer;
      };
      const webpDataURI = req.body.image;
      const jpegBuffer = await convertToJpeg(webpDataURI);
      const blob = new Blob([jpegBuffer], {type:'image/jpeg'});
      const image = await faceapi.bufferToImage(blob);
        // const base64Image = req.body.image;
        // const image = await loadImage(base64Image);
        //   global.Blob = require('blob');
        //   const blob = dataURItoBlob(base64Image, imageType);
        //   const image = await faceapi.bufferToImage(await blob.arrayBuffer());
          
        const faceDescriptor = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

        if (faceDescriptor) {
            const reference = new UserModel({
                name: req.body.name,
                faceDescriptors: [faceDescriptor.descriptor],
            });

            await reference.save();
            faceMatcher.add(reference);

            res.status(200).json({ message: 'Reference image stored successfully' });
        } else {
            res.status(400).json({ message: 'No face found in the image' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
