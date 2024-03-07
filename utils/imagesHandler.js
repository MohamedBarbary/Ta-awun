//fileName = 'defaultFileName', folderName = 'defaultFolderName'
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
exports.storage = (fileName, folderName) => {
  return new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      const folder = folderName;
      const filename = fileName;
      const transformation = { width: 200, height: 200, crop: 'fill' };
      return {
        folder,
        allowedFormats: ['jpeg', 'png', 'jpg'],
        public_id: filename,
        transformation,
      };
    },
  });
};
