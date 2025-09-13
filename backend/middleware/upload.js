const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subDir = 'general';
    
    if (file.fieldname === 'profileImage') {
      subDir = 'profiles';
    } else if (file.fieldname === 'contentImage') {
      subDir = 'content';
    } else if (file.fieldname === 'kycDocument') {
      subDir = 'kyc';
    }
    
    const fullPath = path.join(uploadDir, subDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    profileImage: ['image/jpeg', 'image/png', 'image/jpg'],
    contentImage: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
    kycDocument: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  };
  
  const fieldAllowedTypes = allowedTypes[file.fieldname] || allowedTypes.contentImage;
  
  if (fieldAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${fieldAllowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  }
});

module.exports = upload;