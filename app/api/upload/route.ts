import AWS from "aws-sdk";
import { NextApiRequest, NextApiResponse } from 'next';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fileName, fileType } = req.body;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, 
      Key: fileName,
      ContentType: fileType,
      Expires: 60, 
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);

    res.status(200).json({ uploadURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating upload URL" });
  }
}
