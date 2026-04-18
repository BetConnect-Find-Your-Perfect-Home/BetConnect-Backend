import express from "express";
import {
  addBookmark,
  getBookmarks,
  removeBookmark
} from "../controllers/bookmark.controller.js";
import { bookmarkParamValidator } from "../validators/bookmark.validator.js";
import { validate } from "../middleware/validate.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:propertyId", protect, bookmarkParamValidator, validate, addBookmark);
router.get("/", protect, getBookmarks);
router.delete("/:propertyId", protect, bookmarkParamValidator, validate, removeBookmark);

export default router;
