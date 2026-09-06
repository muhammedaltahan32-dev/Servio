import multer from "multer";
import path from "path";
import fs from "fs";
import { Api_Upload } from "../../../constants/SubApi.js";
import { St_BAD_REQUEST, St_INTERNAL_SERVER_ERROR, St_OK } from "../../../constants/HttpStatus.js";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let uploadDir;
		if (process.env.NODE_ENV === "development") {
			uploadDir = "../public/images/";
		} else {
			//
		}

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		// const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		// cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
		cb(null, file.originalname);
	},
});

const uploadMultiple = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|gif|webp/;
		const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
		const mimetype = allowedTypes.test(file.mimetype);
		cb(null, mimetype && extname);
	},
}).array("images", 10); // max 10 files at once

export const subapi = Api_Upload;

const uploadMultipleHandler = async (req, res) => {
	try {
		if (!req.files || req.files.length === 0) {
			return res.status(St_BAD_REQUEST).json({ success: false, message: "upload.error.noFiles" });
		}

		const filesInfo = req.files.map((file) => ({
			filename: file.filename,
			originalName: file.originalname,
			size: file.size,
			path: file.path,
			mimetype: file.mimetype,
			url: `/images/${file.filename}`,
		}));

		res.status(St_OK).json({
			success: true,
			message: "upload.success.completed",
			files: filesInfo,
		});
	} catch (error) {
		res.status(St_INTERNAL_SERVER_ERROR).json({ success: false, message: "upload.error.failed" });
	}
};

export const post = (req, res) => {
	uploadMultiple(req, res, (err) => {
		if (err) {
			if (err instanceof multer.MulterError) {
				if (err.code === "LIMIT_FILE_SIZE") {
					return res.status(St_BAD_REQUEST).json({ success: false, message: "upload.error.fileTooLarge" });
				}
			}
			return res.status(St_BAD_REQUEST).json({ success: false, message: "upload.error.failed" });
		}
		uploadMultipleHandler(req, res);
	});
};
