import type { RequestHandler } from 'express';

import { v2 as cloudinary } from 'cloudinary';
// cloudinary schaut automatisch nahc einer CLOUDINARY_URL Umgebungsvariablen

const cloudinaryUpload: RequestHandler = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file!.filepath);

    req.body.image = result.secure_url;

    next();
  } catch (err) {
    next(err);
  }
};

export default cloudinaryUpload;
