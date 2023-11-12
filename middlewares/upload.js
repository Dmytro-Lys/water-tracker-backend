import multer from "multer";
import path from "path";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
    destination, 
    filename: (req, file, cb) => {
        const filename = file.originalname;
        cb(null, filename);
    }
});

const limits = {
    fileSize: 5 * 1024 * 1024
}

const fileFilter =  (req, file, cb) => {
    if (file.originalname.split(".").pop() !== "jpg") {
       return cb(new Error("File extention not allow"));
    }
    cb(null, true);
}

const upload = multer({
    storage,
    limits,
    fileFilter
})

export default upload;