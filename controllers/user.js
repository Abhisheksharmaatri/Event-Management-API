//bcryptjs
const bcrypt = require('bcryptjs');

//JWT
const jwt = require('jsonwebtoken');

//Nodemailer
const nodemailer = require('nodemailer');


//Sensitive data
const SensitiveData = require('../sensitive');

//model
const User = require('../models/user');
const sensitive = require('../sensitive');

// /user/signup => POST
exports.signup = async ({
    email,
    name,
    password,
    admissionNumber
}) => {
    let existingUser;
    try {
        existingUser = await User.findOne({
            where: {
                email: email
            }
        });
    } catch (err) {
        console.log(err);
        err.statusCode = 500;
        err.message = 'Internal Server Error';
        return err;
    }
    if (existingUser) {
        const error = new Error('User already exists');
        error.statusCode = 422;
        return error;
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, sensitive.hashingIndex);
    } catch (err) {
        console.log(err);
        err.statusCode = 500;
        err.message = 'Internal Server Error';
        return err;
    }
    let user;
    try {
        user = await User.create({
            email: email,
            name: name,
            password: hashedPassword,
            admissionNumber: admissionNumber
        });
    } catch (err) {
        console.log(err);
        err.statusCode = 500;
        err.message = 'Internal Server Error';
        return err;
    }
    return user;
};

//Verification Email
exports.sendVerificationEmail = async ({
    email,
    name
}) => {
    //Set Up Nodemailer Later
    return {
        message: 'Verification Email Sent',
        statusCode: 200
    }

};

exports.login = async ({
    email,
    password
}) => {
    let user;
    try {
        user = await User.findOne({
            where: {
                email: email
            }
        });
    } catch (err) {
        console.log(err);
        err.statusCode = 500;
        err.message = 'Internal Server Error';
        return err;
    }
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 422;
        return error;
    }
    let passwordMatch;
    try {
        passwordMatch = await bcrypt.compare(password, user.password);
    } catch (err) {
        console.log(err);
        err.statusCode = 500;
        err.message = 'Internal Server Error';
        return err;
    }
    if (!passwordMatch) {
        const error = new Error('Incorrect Password');
        error.statusCode = 422;
        return error;
    }
    const token = jwt.sign({
        email: user.email,
        userId: user.id
    }, sensitive.jwtSecret, {
        expiresIn: '1h'
    });
    return {
        message: 'User logged in successfully',
        statusCode: 200,
        token: token
    }
};

exports.getUser = async ({
    userId
}) => {
    let user;
    try {
        user = await User.findByPk(userId);
    } catch (err) {
        console.log(err);
        err.statusCode = 500;
        err.message = 'Internal Server Error';
        return err;
    }
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 422;
        return error;
    }
    return {
        email: user.email,
        name: user.name,
        admissionNumber: user.admissionNumber,
        verified: user.verified
    };
};

exports.updateUser = async ({
    name,
    admissionNumber,
    userId
}) => {
    let user;
    try {
        user = await User.findByPk(userId);
    } catch (err) {
        console.log(err);
        err.statusCode = 500;
        err.message = 'Internal Server Error';
        return err;
    }
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 422;
        return error;
    }
    user.name = name;
    user.admissionNumber = admissionNumber;
    try {
        await user.save();
    } catch (err) {
        console.log(err);
        err.statusCode = 500;
        err.message = 'Internal Server Error';
        return err;
    }
    return {
        message: 'User updated successfully',
        statusCode: 200
    }
};

exports.deleteUser = async ({
    userId
}) => {
    let user;
    try {
        user = await User.findByPk(userId);
    } catch (err) {
        console.log(err);
        err.statusCode = 500;
        err.message = 'Internal Server Error';
        return err;
    }
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 422;
        return error;
    }
    try {
        await user.destroy();
    } catch (err) {
        console.log(err);
        err.statusCode = 500;
        err.message = 'Internal Server Error';
        return err;
    }
    return {
        message: 'User deleted successfully',
        statusCode: 200
    }
};