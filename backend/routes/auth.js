const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = "Harshispro$heheboii" ;

// ROUTE 1: Create a user using: POST  "/api/auth/createuser  No login required"

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false;
      return res.status(400).json({success, errors: errors.array() });
    }
    try{
    // Check if email already exists
    let user = await User.findOne({ email: req.body.email });
    if(user){
        success = false;
        return res.status(400).json({success, error: "User already exists"});
    }
    // Hashing the password and adding salt
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword
    })
    const data = {
        user:{
            id: user.id
        }
    }

    const authToken = jwt.sign(data, JWT_SECRET);  // Generating the token
    success = true; 
    res.json({success, authToken});
    }
    catch(err){
    console.error(err.message);
    res.status(500).send("Server Error");
    }
})

// ROUTE 2: Authentication a user using: POST  "/api/auth/login  No login required"

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false;
      return res.status(400).json({success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try{
        let user = await User.findOne({ email });
        if(!user){
            success = false;
            return res.status(400).json({success, error: "Wronge credentials"});
        }
        const passCompare = await bcrypt.compare(password, user.password);
        if(!passCompare){
            success = false;
            return res.status(400).json({success, error: "Wronge credentials"});
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken});
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// ROUTE 2: Getting user data using: POST  "/api/auth/getdata  Login required"

router.post('/getdata', fetchUser, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})
module.exports = router;