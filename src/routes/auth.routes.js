import express from 'express';
import {register, login} from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/register',registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

export default router; 