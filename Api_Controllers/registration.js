const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Table_Models/user');



// User Registration

exports.register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (userName && email && password) {
            const exist = await User.findOne({
                where: { email: email }
            });
            if (exist) {
                return res.status(400).json({
                    'status': 'failed',
                    'message': 'emailId already taken'
                })
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);
                const user = await User.create({
                    userName: userName,
                    email: email,
                    password: hashPassword
                });
                if (user) {
                    return res.status(200).json({
                        'status': 'success',
                        'message': 'user created successfully'
                    })
                } else {
                    return res.status(400).json({
                        'status': 'success',
                        'message': 'please enter details correctly'
                    })
                };
            }
        } else {
            return res.status(400).json({
                'status': 'Failed',
                'message': 'Please fill all require fields'
            })
        }
    } catch (err) {
        return res.status(500).json({
            'status': 'Failed',
            'message': err.message
        })
    }
};




// User Login

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await User.findOne({
                where: { email: email }
            });
            if (user) {
                const validatePassword = await bcrypt.compare(password, user.password);
                if (validatePassword) {
                    const token = await jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);
                    return res.status(200).json({
                        'status': 'success',
                        'message': 'user loggged in successfully',
                        'jwt_Token': token
                    });
                } else {
                    return res.status(400).json({
                        'status': 'failed',
                        'message': 'wrong password'
                    })
                }
            } else {
                return res.status(400).json({
                    'status': 'failed',
                    'message': 'email not exists'
                })
            }
        } else {
            return res.status(400).json({
                'status': 'Failed',
                'message': 'Please fill all require fields'
            })
        }
    } catch (err) {
        return res.status(500).json({
            'status': 'Failed',
            'message': err.message
        })
    }

};