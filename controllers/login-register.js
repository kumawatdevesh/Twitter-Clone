const Register = require('../util/register');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');
const crypto = require('crypto');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    res.render('login',{
        errorMessage: req.flash('error'),
        oldInput: {
            email: ''
        }
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('login',{
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email
            }
        });
    }
    Register.findOne({email: email})
    .then(user => {
    if(!user){
        req.flash('error', 'invalid email or password');
        return res.redirect('/login');
    }
    return bcrypt.compare(password, user.password)
        .then(hashedpassword => {
            if(hashedpassword){
                req.session.isLoggedIn = true;
                req.session.user = user;
            return res.redirect('/tweets/' + user.id);
            }
            req.flash('error', 'invalid email or password');
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getRegister = (req, res, next) => {
    res.render('register', {
        errorMessage: req.flash('error')
    });
};

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    Register.findOne({email: email})
    .then(user => {
        if(user){
            req.flash('error', 'email address already exists, please pick a different one');
            return res.redirect('/register');
        }
    return bcrypt.hash(password, 12)
    .then(hashedpassword =>{
        const register = new Register({
            id: Math.random(),
            name: name,
            lastname: lastname,
            email: email,
            password: hashedpassword
        });
        req.session.user = register;
        req.session.isLoggedIn = true;
        return register.save();
        })
        .then(result => {
           // res.redirect('/profile?register=true');
           res.redirect('/tweets/'+ result.id);
           return transporter.sendMail({
            to: email,
            from: 'shop@node-complete.com',
            subject: 'signedup succsessfully',
            html: '<h1>You are signed in succsessfully!<h1>'
        }, function(err, info){
            if(err){
                console.log(err);
            }
        })
    })
    .catch(err => {
        console.log(err);
    })
})
    .catch(err => {
        console.log(err);
    });
};

exports.Logout = (req, res, next) => {
    console.log('destroyed the session');
    req.session.destroy();
};

exports.getReset = (req, res, next) => {
    res.render('reset', {

    }); 
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err);
            return res.redirect('/login');
        }
        const token = buffer.toString('hex');
        Register.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                return res.redirect('/register');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result => {
            res.redirect('/login')
            return transporter.sendMail({
                to: req.body.email,
                from: 'shop@node-complete.com',
                subject: 'password reset',
                html: `
                <p>you requested password reset</p>
                <p>click this <a href="http://localhost:5000/reset/${token}">link</a> to procedd further</p>
                `
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    Register.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
        res.render('new-pass',{
            passwordToken: token,
            userId: req.session.user.id.toString()
        });
    })
    .catch(err => {
        console.log(err);
    }); 
};

exports.updateNewPassword = (req, res, next) => {
    const pass = req.body.password;
    const token = req.body.passwordToken;
    const userId = req.body.userId;
    let resetUser;

    Register.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()},
    id: userId
    })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(pass, 12);
    })
    .then(hashedpassword => {
        resetUser.password = hashedpassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log(err);
    })

};