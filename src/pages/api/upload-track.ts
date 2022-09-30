import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";

import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const filename = req.query.filename as string;

  const form = new formidable.IncomingForm({
    filename: (name, ext) => {
      return filename + ext;
    },
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    console.log({ err, fields, files });
  });
}
