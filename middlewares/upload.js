import multer from 'multer';

const storage = multer.memoryStorage(); // Guarda la imagen en memoria temporal
const upload = multer({ storage });

export default upload;