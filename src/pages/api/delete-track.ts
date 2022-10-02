import type { NextApiRequest, NextApiResponse } from "next";

import { unlinkSync } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const filename = req.query.id as string;
  const uploadDir = "/tmp/tracks";

  try {
    unlinkSync(`${uploadDir}/${filename}.mp3`);
    return res.status(200).send({
      success: true,
      error: false,
    });
  } catch {
    return res.status(404).send({
      error: true,
      message: "Could not find or delete file.",
    });
  }
}
