const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {validateRegistration, validateLogin} = require('../middleware/validation')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const express = require('express')
const app = express();



router.get('/registration/', async(req, res)=>{
    res.send({name: "JohnDoe"})
})


// making a new user using the POST api

router.post('/registration/',  async (req, res)=>{
    console.log(req.body);
    // validating the user given
    const result = await validateRegistration.validateAsync(req.body)
    console.log(result);

    // checking for existing usernames and emails
    const checkEmail = await User.findOne({email: req.body.email})
    const checkUsername = await User.findOne({username: req.body.username})

    if(checkEmail) return res.status(400).send("Email already exists")
    if(checkUsername) return res.status(400).send("Username already exists")

    // hashing the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    })

    try {
        const newUser = await user.save()
        res.send(newUser); 
    } catch (error) {
        console.log(error);
    }
})


app.use(cors())

router.get('/login', async (req, res) => {
    const user = await User.find()
    res.json(user);
})


router.post('/login/', async (req, res) =>{
    // verifying the login details
    const {error}= await validateLogin.validateAsync(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    // verifying if the user exists
    const user = await User.findOne({username: req.body.username})
    if(!user) return res.status(400).json({message: "failure"})

    const validPassword = bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send("Enter a valid password")

    res.status(200).send(user)
})

// working with google authentication
app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

router.get('registration/google/failed', (req, res)=>{
    res.send("authentication failed");
})

router.get('/registration/google', 
    passport.authenticate('google', {
        successRedirect: "",
        failureRedirect: "registration/google/failed",
    })
)


// working with linkedin authentication
router.get('registration/linkedin/failed', (req, res) => {
    res.send("authentication failed");
})


router.get('/registration/linkedin', 
    passport.authenticate('linkedin', {
        successRedirect: "", 
        failureRedirect: "",
    })
)

module.exports = router;