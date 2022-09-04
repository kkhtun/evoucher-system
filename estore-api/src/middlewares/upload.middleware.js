const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: "ap-southeast-1",
});

const s3 = new aws.S3();

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/svg+xml",
];

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    } else {
        return cb(
            new Error(
                `Invalid image file type, only ${allowedMimeTypes.join(
                    ", "
                )} are allowed`
            )
        );
    }
};

const upload = () => {
    const bucket = process.env.S3_BUCKET;
    return multer({
        fileFilter,
        storage: multerS3({
            s3,
            bucket,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                const fileName =
                    Date.now().toString() +
                    "_" +
                    file.originalname.replace(/ /g, "_");
                const imageUrl = `https://${bucket}.s3-ap-southeast-1.amazonaws.com/${fileName}`;
                req.body.image = imageUrl;

                return cb(null, fileName);
            },
        }),
    });
};

module.exports = upload;
