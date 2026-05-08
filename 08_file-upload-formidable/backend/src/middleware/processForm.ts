import type { RequestHandler } from 'express';
import formidable from 'formidable';
import { type Options } from 'formidable';

const options: Options = {
  filter: function ({ mimetype }) {
    return Boolean(mimetype && mimetype.includes('image'));
  },
  maxFileSize: 1024 * 1024 * 5 // 5mb
};

const processForm: RequestHandler = async (req, res, next) => {
  const form = formidable(options);

  let fields;
  let files;

  try {
    [fields, files] = await form.parse(req);
  } catch (err) {
    next(err);
  }

  if (!files || !files.image) {
    throw new Error('Please upload an image', { cause: { status: 400 } });
  }

  req.body = fields;
  req.file = files.image[0];

  next();
};

export default processForm;
