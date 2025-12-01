import { S3Client, PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner" 
import { NextRequest, NextResponse } from "next/server"

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

export const POST = async (req: NextRequest) => {
    try {
    const { fileName, contentType } = await req.json();
    if (!fileName || !contentType) return NextResponse.json({ error: 'missing' }, { status: 400 });

    const bucket = process.env.S3_BUCKET_NAME!;
    const key = `uploads/${Date.now()}-${fileName}`;

    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      ACL: 'private', // or 'public-read' if you intend public objects
    });

    // short expiry (e.g. 60s)
    const signedUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 });

    return NextResponse.json({ signedUrl, objectKey: key, objectUrl: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: 'server error' }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
    const body = await req.json().catch(() => ({}));
    const keys = normalizeKeys(body.keys ?? body.key ?? body); // flexible: { key } | { keys } | raw body === ["a","b"]

    if (keys.length === 0) {
      return NextResponse.json({ error: 'No object keys provided' }, { status: 400 });
    }

    if (keys.length > 1000) {
      return NextResponse.json({ error: 'Can delete up to 1000 objects per request' }, { status: 400 });
    }

    const Bucket = process.env.S3_BUCKET_NAME!;
    const command = new DeleteObjectsCommand({
      Bucket,
      Delete: {
        Objects: keys.map(Key => ({ Key })),
        Quiet: false, // false so AWS returns which ones deleted
      },
    });

    const resp = await s3.send(command);

    // resp.Deleted => list of successfully deleted objects
    // resp.Errors => list of errors for specific keys
    const deleted = (resp.Deleted ?? []).map(d => d.Key);
    const errors = (resp.Errors ?? []).map(e => ({ key: e.Key, code: e.Code, message: e.Message }));

    return NextResponse.json({ success: true, deleted, errors });
  } catch (err: any) {
    console.error('s3-multi-delete-error', err);
    return NextResponse.json({ success: false, message: 'Server error deleting objects' }, { status: 500 });
  }
}

function normalizeKeys(input: unknown): string[] {
  if (!input) return [];
  if (typeof input === 'string') return [input];
  if (Array.isArray(input)) return input.filter(k => typeof k === 'string' && k.length > 0);
  return [];
}