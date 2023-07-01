const express = require('express');

//Validator
const {
    body,
    validationResult
} = require('express-validator');

//Controller
const userController = require('../controllers/user');

//Sensitive data
const {
    passwordLength,
    admissionNumberLength
} = require('../sensitive');

//Authentication
const auth = require('../middleware/auth');

const router = express.Router();


// /user/signup => POST
router.post('/signup',
    [
        body('email')
        .not()
        .isEmpty()
        .withMessage('Please enter an email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
        body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please enter a valid name'),
        body('password')
        .trim()
        .isLength({
            min: passwordLength
        })
        .withMessage('Please enter a valid password'),
        body('admissionNumber')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please enter an admission number')
        .isLength({
            min: admissionNumberLength
        })
        .withMessage('Please enter a valid admission number')
    ], async (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            const err = new Error('Validation failed');
            err.statusCode = 422;
            err.data = validationErrors.array();
            return next(err);
        }
        const result = await userController.signup({
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            admissionNumber: req.body.admissionNumber,
            verified: false
        });
        if (result.statusCode === 500 || result.statusCode === 422) {
            return next(result);
        }
        const verificationResult = await userController.sendVerificationEmail({
            email: req.body.email,
            name: req.body.name
        });
        if (verificationResult.statusCode === 500 || verificationResult.statusCode === 422) {
            return next(verificationResult);
        }
        res.status(200).json({
            message: 'User created successfully',
            statusCode: 200
        });
    }
);
// /user/login => POST
router.post('/login', [
    body('email')
    .not()
    .isEmpty()
    .withMessage('Please enter an email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({
        min: passwordLength
    })
    .withMessage('Please enter a valid password')
], async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const err = new Error('Validation failed');
        err.statusCode = 422;
        err.data = validationErrors.array();
        return next(err);
    }
    const result = await userController.login({
        email: req.body.email,
        password: req.body.password
    });
    if (result.statusCode === 500 || result.statusCode === 422) {
        return next(result);
    }
    res.status(200).json({
        message: 'User logged in successfully',
        statusCode: 200,
        token: result.token,
    });
});

// /user/get-user


// // /user/getUserById => GET
router.get('/get-user', auth,
    async (req, res, next) => {
        if (req.auth !== true) {
            const error = new Error('Not authenticated');
            error.statusCode = 401;
            return next(error);
        }
        const result = await userController.getUser({
            userId: req.userId
        });
        if (result.statusCode === 500 || result.statusCode === 422) {
            return next(result);
        }
        return res.status(200).json({
            message: 'User fetched successfully',
            statusCode: 200,
            user: result
        });
    });

// // /user/updateUser => PUT
router.put('/update-user', auth,
    [body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please enter a valid name'),
        body('admissionNumber')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please enter an admission number')
        .isLength({
            min: admissionNumberLength
        })
        .withMessage('Please enter a valid admission number'),
    ], async (req, res, next) => {
        if (req.auth !== true) {
            const error = new Error('Not authenticated');
            error.statusCode = 401;
            return next(error);
        }
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            const err = new Error('Validation failed');
            err.statusCode = 422;
            err.data = validationErrors.array();
            return next(err);
        }
        const result = await userController.updateUser({
            name: req.body.name,
            admissionNumber: req.body.admissionNumber,
            userId: req.userId
        });
        if (result.statusCode === 500 || result.statusCode === 422) {
            return next(result);
        }
        return res.status(200).json({
            message: 'User updated successfully',
            statusCode: 200
        });
    });

// // /user/deleteUser => DELETE
router.delete('/delete-user', auth, async (req, res, next) => {
    if (req.auth !== true) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        return next(error);
    }
    const result = await userController.deleteUser({
        userId: req.userId
    });
    if (result.statusCode === 500 || result.statusCode === 422) {
        return next(result);
    }
    return res.status(200).json({
        message: 'User deleted successfully',
        statusCode: 200
    });
});

// // /user/getAllBookings => GET
// router.get('/get-all-bookings', auth, async(req, res, next)=>{});


module.exports = router;