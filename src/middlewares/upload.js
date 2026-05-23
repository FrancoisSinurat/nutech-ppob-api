const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

function imageFilter(_req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(
      Object.assign(new Error('Format Image tidak sesuai'), { statusCode: 400, status: 102 })
    );
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter: imageFilter });

module.exports = upload;
