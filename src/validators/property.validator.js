import { body, query, param } from 'express-validator';

export const createPropertyValidator = [
  body('size')
    .notEmpty().withMessage('Size is required'),

  body('type')
    .notEmpty().withMessage('Property type is required')
    .isIn(['apartment', 'villa', 'studio', 'house'])
    .withMessage('Invalid property type'),

  body('floor')
    .optional()
    .isInt({ min: 0 }).withMessage('Floor must be a positive number'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('subcity')
    .notEmpty().withMessage('Subcity is required'),

  body('woreda')
    .notEmpty().withMessage('Woreda is required'),

  body('kebele')
    .optional()
];

export const updatePropertyValidator = [
  param('id')
    .isMongoId().withMessage('Invalid property ID'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be positive'),

  body('type')
    .optional()
    .isIn(['apartment', 'villa', 'studio', 'house'])
];

export const propertyQueryValidator = [
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }),

  query('type')
    .optional()
    .isIn(['apartment', 'villa', 'studio', 'house']),

  query('woreda')
    .optional()
    .isString()
];