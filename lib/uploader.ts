import axios from 'axios';

export const uploader = async (file: File | undefined) => {
    if (!file) return;

    const res = await axios.post('/api/upload', {
      fileName: file.name,
      contentType: file.type,
    });
    const { signedUrl, objectUrl, objectKey } = res.data;

    if (!signedUrl) { console.error('no signed url'); return; }

    // PUT file directly to S3
    const upload = await axios.put(signedUrl, file, {
      headers: { 'Content-Type': file.type },
    });

    if (upload.status !== 200) {
      console.error('upload failed', upload.statusText);
      return;
    }

    console.log('upload done', objectUrl);
}
