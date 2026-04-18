import { param } from "express-validator";

export const bookmarkParamValidator = [
  param("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isMongoId()
    .withMessage("Invalid Property ID format"),
];