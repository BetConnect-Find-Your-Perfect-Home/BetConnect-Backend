import express from 'express';
import {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
} from '../controllers/property.controller.js';
import { protect, approvedAgent, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import {
    createPropertyValidator,
    updatePropertyValidator
} from '../validators/property.validator.js';

const router = express.Router();

router.route('/')
    .post(protect, approvedAgent, validate(createPropertyValidator), createProperty)
    .get(optionalAuth, getProperties);

router.route('/:id')
    .get(optionalAuth, getPropertyById)
    .put(protect, validate(updatePropertyValidator), updateProperty)
    .delete(protect, deleteProperty);

export default router;
