import { body, param, validationResult } from 'express-validator';
export const validate = (req, res, next) => { const errors = validationResult(req); if (!errors.isEmpty()) return res.status(422).json({ success: false, message: errors.array()[0].msg, errors: errors.array() }); next(); };
export const registerRules = [body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'), body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')];
export const loginRules = [body('email').isEmail().normalizeEmail(), body('password').notEmpty()];
export const productRules = [body('name').trim().notEmpty().withMessage('Product name is required'), body('description').trim().notEmpty().withMessage('Description is required'), body('price').isFloat({ min: 0.01 }).withMessage('Price must be positive'), body('category').trim().notEmpty().withMessage('Category is required'), body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')];
export const idRule = [param('id').notEmpty()];
