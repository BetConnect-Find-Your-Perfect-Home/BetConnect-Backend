import { param } from "express-validator";

export const bookmarkParamValidator = [
  param("propertyId")
    .notEmpty()
    .isMongoId()
    .withMessage("Invalid Property ID format"),
];