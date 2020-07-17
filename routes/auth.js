const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

const isAuth = require('../middleware/logged');

const User = require('../models/user');

const { check , body } = require('express-validator/check');

router.get('/register',authController.getRegister);


router.post('/register',

body('user_name').custom((value,{req}) => {
    return User.findOne({ where : { user_name : value}})
    .then(exists => {
        if(exists)
        {
        return Promise.reject('UserName already exists');
        }
    })
})

,
body('first_name','Enter first name').isLength({ min : 1}),

body('last_name','Enter last name').isLength({ min : 1}),
body('dob','Enter your date of birth').isLength({ min : 1}),

check('email').
isEmail().withMessage('Please Enter a valid email')
.custom(( value , {req}) => {
    return User.findOne({ where : { email : value}})
    .then(exists => {
        if(exists)
        {
            return Promise.reject('Email already exists');
        }
    })
})
.normalizeEmail(),
body('phone_number','Enter a valid phone number').isLength({ min : 10 , max : 10}),
body('password','Please enter a password of atleast 5 characters and no special characters are allowed.')
.isLength({min:5})
.isAlphanumeric(),
body('confirm_password').custom((value,{req}) => {
    if(value !== req.body.password)
    {
        throw new Error('Passwords do not match');
    }
    return true;
})
,
body('address','Enter your address').isLength({ min : 10}),
check('gridCheck1').custom((value,{req}) => {
    if(!value)
    {
        return Promise.reject('Accept terms and conditions');
    }
    return true;
}),




authController.postRegister);


router.get('/login',authController.getLogin);

router.post('/login',
authController.postLogin);

router.get('/logout',authController.postLogout);

module.exports = router;