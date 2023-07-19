const asyncHandler = require('express-async-handler');
const bcyrpt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')

//@desc Register User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  const mandatoryFields = !username || !email || !password;
  if(mandatoryFields) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }
  const userAvailable = await User.findOne({email});
  if(userAvailable) {
    res.status(400);
    throw new Error('User already registered');
  }

  // Hash password
  const hashPassword = await bcyrpt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashPassword
  });

  if(user) {
    res.status(201).json({_id: user.id, email: user.email});
  } else {
    res.status(400);
    throw new Error('User data is not valid');
  }
  res.json({message: 'Register the user'});
});

//@desc Login User
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const mandatoryFields = !email || !password;
  
  if(mandatoryFields) {
    res.status(400)
    throw new Error('All fields are mandatory!');
  }

  const user = await User.findOne({email});
  const checkUserPassword = user && (await bcyrpt.compare(password, user.password));
  if(checkUserPassword) {
    const accessToken = jwt.sign({
      user: {
        username: user.username,
        email: user.email,
        id: user.id
      },
    }, 
      process.env.ACCESS_TOKEN_SECRET, 
      {expiresIn: "15m"}
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401)
    throw new Error('Email or password is not valid');
  }
});

//@desc Current User Info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => res.json(req.user) );

module.exports = { registerUser, loginUser, currentUser }