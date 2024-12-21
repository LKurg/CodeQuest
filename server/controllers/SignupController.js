
const {User} = require('../models/User');
const bcrypt = require('bcryptjs');

const Signup = async (req, res) => {
    const {username, email, password} = req.body;
    try{
        const existingUser =await User.findOne({email});
        if(existingUser){
            return res.status(400).json({error: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            subscription:{}
        });
        await newUser.save();
        res.status(201).json({message: 'User created successfully'});
    
    }catch(error){
        next(error);
    }
}
module.exports = {Signup};