import type { NextApiRequest } from "next";

import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest) {
  const filename = req.query.filename as string;

  const form = new formidable.IncomingForm({
    filename: (name, ext) => {
      return filename + ext;
    },
    uploadDir: "/tmp/tracks",
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    console.log({ err, fields, files });
  });
}
