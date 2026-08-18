import crypto from 'crypto';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../config/.env') });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const timestamp = Math.floor(Date.now() / 1000);
const folder = 'roma_film/images';
const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

const formData = new URLSearchParams();
formData.append('file', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
formData.append('api_key', apiKey || '');
formData.append('timestamp', timestamp.toString());
formData.append('signature', signature);
formData.append('folder', folder);

async function test() {
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });
  const data = await res.text();
  console.log('HTTP Status:', res.status);
  console.log('Cloudinary Response:', data);
}

test();
