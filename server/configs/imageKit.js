import ImageKit from '@imagekit/nodejs';

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export default imagekit;
//private_aytaXXiJpnawnQ7mfyo3ekHJc7c