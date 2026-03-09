import express from "express";
import {
  downloadFile,
  downloadImage,
  downloadIcon,
  downloadVideo,
} from "../controllers/downloadController.js";

const router = express.Router();

router.get("/download", downloadFile);
router.get("/download/image", downloadImage);
router.get("/download/icon", downloadIcon);
router.get("/download/video", downloadVideo);

export default router;
