const User = require('../models/user');

const crypto = require('crypto');
const bcrypt = require('bcrypt');

const { validationResult } = require('express-validator/check');

const nodemailer = require('nodemailer');
const sendgridtransport = require('nodemailer-sendgrid-transport');


 


const transporter = nodemailer.createTransport(sendgridtransport({
    auth : {
        api_key : ''
    }
}));
exports.getRegister = (req,res,next) => {
    if(req.session.isLoggedIn==true)
    {
        return res.redirect('/');
    }
    res.render('auth/register',{
        title : 'Register',
        page : 'register',
        errormessage : false,
        validationError : [],
        isLoggedIn : false,
        user : false
    })
}

exports.postRegister = (req,res,next) => {

    if(req.session.isLoggedIn==true)
    {
        return res.redirect('/');
    }
    const errors = validationResult(req);
    console.log(errors.array());

    if(!errors.isEmpty())
    {
        return res.status(422).render('auth/register',{
            page : 'register',
            title : 'Register',
            errormessage : errors.array()[0].msg,
            validationError : errors.array(),
            isLoggedIn : false,
            user : false
        })
    }
    const first_name = req.body.first_name;
    const middle_name = req.body.middle_name;
    const last_name = req.body.last_name;
    const user_name = req.body.user_name;
    let password = req.body.password;
    const phone_num = req.body.phone_number;
    const address = req.body.address;
    const email = req.body.email;
    const dob = req.body.dob;

    bcrypt.hash(password,12)
    .then(result => {
        console.log(result);
        password = result;
        return User.create({
            first_name : first_name,
            middle_name : middle_name,
            last_name : last_name,
            user_name : user_name,
            password : password,
            phone_num : phone_num,
            address : address,
            email : email,
            dob : dob
        })
    })
    .then(result => {
        console.log(result);
        res.redirect('/login');
        
            return  transporter.sendMail({
             to : email,
             from : 'booktraintickets066@gmail.com',
             subject : 'signup succeeded',
             html : '<h1>You successfully signed up<h1>'
         })
    })
    .catch(err => {
        console.log(err);
    })

    
}

exports.getLogin = (req,res,next) => {
    if(req.session.isLoggedIn==true)
    {
        return res.redirect('/');
    }
    const train_id = req.body.train_id;
    console.log(train_id);
    res.render('auth/login',{
        title : 'Login',
        page : 'login',
        errormessage : false,
        isLoggedIn : req.session.isLoggedIn,
        user : req.session.user,
        arr : {}
    })
}

exports.postLogin = (req,res,next) => {
    if(req.session.isLoggedIn==true)
    {
        return res.redirect('/');
    }
    const user_name = req.body.user_name;
    console.log(user_name);
    const password = req.body.password;

    const errors = validationResult(req);
    console.log(errors.array());

    if(!errors.isEmpty())
    {
        return res.status(422).render('auth/login',{
            page : 'Login',
            title : 'login',
            errormessage : errors.array()[0].msg,
            validationError : errors.array(),
            isLoggedIn : false,
            user : false,
            set : true
        })
    }
    User.findOne( {where : { user_name : user_name }} )
    .then(result => {
        console.log(result);
        if(!result)
        {
            return res.status(422).render('auth/login',{
                page : 'Login',
                title : 'login',
                errormessage : 'Invalid user-name or password',
                validationError : errors.array(),
                isLoggedIn : false,
                user : false,
                set : true
            })
            
        }
        bcrypt.compare(password,result.password)
            .then(results => {
                console.log('from inside' + results);
                if(results)
                {
                    req.session.isLoggedIn = true;
                    req.session.user = result;
                    return res.redirect('/booking');
                }
                return res.status(422).render('auth/login',{
                    page : 'Login',
                    title : 'login',
                    errormessage : 'Invalid user-name or password',
                    validationError : errors.array(),
                    isLoggedIn : false,
                    user : false,
                    set : true
                })
            })
            .catch(err => {
                return res.render('err');
                console.log(err);
            })
        
    })
    .catch(err => {
        console.log(err);
    })


}

exports.postLogout = (req,res,next) => {
    req.session.isLoggedIn = false;
    req.session.user = false;
    res.redirect('/');
}
