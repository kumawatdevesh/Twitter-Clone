const express = require('express');
const { check, body } = require('express-validator/check');
const router = express.Router();

const loginController = require('../controllers/login-register');
const profileController = require('../controllers/profile');

router.get('/login', loginController.getLogin);

router.post('/login', check('email')
.isEmail().
withMessage('please enter a valid email')
.custom((value, {req}) => {
    if(value === 'sapna@gmail.com'){
        throw new Error('this email is not allowed');
    }
    return true; 
}),
body('password', 'please enter a password with more than 5 charcaters')
.isLength({min: 5})
.isAlphanumeric(), loginController.postLogin);

router.get('/profile', profileController.getProfile);

router.post('/profile', profileController.postProfile);

router.get('/register', loginController.getRegister);

router.post('/register', loginController.postRegister);

router.post('/logout', loginController.Logout);

router.get('/edit-profile/:id', profileController.getEditProfile);

router.post('/edit-profile', profileController.getPostProfile);

router.get('/reset', loginController.getReset);

router.post('/reset', loginController.postReset);

router.get('/reset/:token', loginController.getNewPassword);

router.post('/new-password', loginController.updateNewPassword);

module.exports = router;