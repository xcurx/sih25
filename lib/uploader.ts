import axios from 'axios';

export const uploader = async (file: File | undefined, folder: string = 'uploads'): Promise<{ url: string; publicId: string } | null> => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.status !== 200 || !res.data.url) {
        console.error('upload failed', res.statusText);
        return null;
    }

    console.log('upload done', res.data.url);
    return { url: res.data.url, publicId: res.data.publicId };
}